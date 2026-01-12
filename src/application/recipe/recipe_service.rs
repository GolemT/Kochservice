use crate::application::recipe::common::{
    CreateRecipeCommand, DeleteRecipeCommand, GetAllRecipesCommand, GetRecipeCommand,
    UpdateRecipeCommand,
};
use crate::domain::entities::{ingredient, recipe, recipe_ingredient, recipe_tag, tag};
use crate::domain::recipe::recipe::Recipe;
use crate::domain::recipe_ingredient::recipe_ingredient::{MeasurementType, RecipeIngredient};
use crate::domain::tag::tag::Tag;
use crate::infrastructure::error::AppError;
use sea_orm::{ActiveModelTrait, ColumnTrait, ConnectionTrait, Set, TransactionTrait};
use sea_orm::{DatabaseConnection, EntityTrait, QueryFilter};
use std::str::FromStr;
use uuid::Uuid;

pub async fn create_recipe(
    db: &DatabaseConnection,
    command: CreateRecipeCommand,
) -> Result<Recipe, AppError> {
    let txn = db.begin().await?;

    // 1. Recipe erstellen
    let recipe = Recipe::new(
        command.name,
        command.instructions,
        vec![], // Temporär leer
        vec![], // Temporär leer
    );

    let recipe_active = recipe::ActiveModel {
        id: Set(recipe.id().value()),
        name: Set(recipe.name().to_string()),
        instructions: Set(
            serde_json::to_value(recipe.instructions()).map_err(|_| AppError::Internal)?
        ),
    };

    let saved_recipe = recipe_active.insert(&txn).await?;

    // 2. RecipeIngredients erstellen
    let mut ingredients = Vec::new();
    for ingredient_data in command.ingredients {
        let recipe_ingredient = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(saved_recipe.id),
            ingredient_id: Set(ingredient_data.ingredient_id),
            amount: Set(ingredient_data.amount),
            measurement: Set(ingredient_data.measurement.to_string()),
        };

        let saved_ri = recipe_ingredient.insert(&txn).await?;

        // Ingredient für Response laden
        let ingredient_model = ingredient::Entity::find_by_id(saved_ri.ingredient_id)
            .one(&txn)
            .await?
            .ok_or_else(|| AppError::NotFound("Ingredient not found".into()))?;

        ingredients.push(RecipeIngredient::from_existing(
            saved_ri.id.into(),
            ingredient_model.into(),
            saved_ri.amount,
            MeasurementType::from_str(&saved_ri.measurement)?,
        ));
    }

    // 3. RecipeTags erstellen
    let mut tags = Vec::new();
    for tag_id in command.tag_ids {
        let recipe_tag = recipe_tag::ActiveModel {
            recipe_id: Set(saved_recipe.id),
            tag_id: Set(tag_id),
        };

        recipe_tag.insert(&txn).await?;

        // Tag für Response laden
        let tag_model = tag::Entity::find_by_id(tag_id)
            .one(&txn)
            .await?
            .ok_or_else(|| AppError::NotFound("Tag not found".into()))?;

        tags.push(tag_model.into());
    }

    // Transaktion abschließen
    txn.commit().await?;

    // Recipe mit allen Daten zurückgeben
    Ok(Recipe::from_existing(
        saved_recipe.id.into(),
        saved_recipe.name,
        serde_json::from_value(saved_recipe.instructions).map_err(|_| AppError::Internal)?,
        ingredients,
        tags,
    ))
}

pub async fn get_recipe(
    db: &DatabaseConnection,
    command: GetRecipeCommand,
) -> Result<Recipe, AppError> {
    let recipe_model = recipe::Entity::find_by_id(command.id)
        .one(db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Recipe '{}' not found", command.id)))?;

    let ingredients = load_recipe_ingredients(db, command.id).await?;
    let tags = load_recipe_tags(db, command.id).await?;

    Ok(Recipe::from_existing(
        recipe_model.id.into(),
        recipe_model.name,
        serde_json::from_value(recipe_model.instructions).map_err(|_| AppError::Internal)?,
        ingredients,
        tags,
    ))
}

pub async fn get_all(
    db: &DatabaseConnection,
    command: GetAllRecipesCommand,
) -> Result<(Vec<Recipe>, u64), AppError> {
    use sea_orm::PaginatorTrait;

    let paginator = recipe::Entity::find().paginate(db, command.page_size);

    let total_pages = paginator.num_pages().await?;
    let recipes_models = paginator.fetch_page(command.page).await?;

    let mut recipes = Vec::new();
    for recipe_model in recipes_models {
        let ingredients = load_recipe_ingredients(db, recipe_model.id).await?;
        let tags = load_recipe_tags(db, recipe_model.id).await?;

        recipes.push(Recipe::from_existing(
            recipe_model.id.into(),
            recipe_model.name,
            serde_json::from_value(recipe_model.instructions).map_err(|_| AppError::Internal)?,
            ingredients,
            tags,
        ));
    }

    Ok((recipes, total_pages))
}
pub async fn update_recipe(
    db: &DatabaseConnection,
    command: UpdateRecipeCommand,
) -> Result<Recipe, AppError> {
    let txn = db.begin().await?;

    // 1. Prüfen ob existiert
    let existing = recipe::Entity::find_by_id(command.id)
        .one(&txn)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Recipe '{}' not found", command.id)))?;

    // 2. Recipe updaten
    let mut recipe_active: recipe::ActiveModel = existing.into();
    recipe_active.name = Set(command.name);
    recipe_active.instructions =
        Set(serde_json::to_value(&command.instructions).map_err(|_| AppError::Internal)?);

    let updated_recipe = recipe_active.update(&txn).await?;

    // 3. ALTE RecipeIngredients löschen
    recipe_ingredient::Entity::delete_many()
        .filter(recipe_ingredient::Column::RecipeId.eq(command.id))
        .exec(&txn)
        .await?;

    // 4. NEUE RecipeIngredients einfügen
    let mut ingredients = Vec::new();
    for ingredient_data in command.ingredients {
        let recipe_ingredient = recipe_ingredient::ActiveModel {
            id: Set(Uuid::now_v7()),
            recipe_id: Set(command.id),
            ingredient_id: Set(ingredient_data.ingredient_id),
            amount: Set(ingredient_data.amount),
            measurement: Set(ingredient_data.measurement.to_string()),
        };

        let saved_ri = recipe_ingredient.insert(&txn).await?;

        let ingredient_model = ingredient::Entity::find_by_id(saved_ri.ingredient_id)
            .one(&txn)
            .await?
            .ok_or_else(|| AppError::NotFound("Ingredient not found".into()))?;

        ingredients.push(RecipeIngredient::from_existing(
            saved_ri.id.into(),
            ingredient_model.into(),
            saved_ri.amount,
            MeasurementType::from_str(&saved_ri.measurement)?,
        ));
    }

    // 5. ALTE RecipeTags löschen
    recipe_tag::Entity::delete_many()
        .filter(recipe_tag::Column::RecipeId.eq(command.id))
        .exec(&txn)
        .await?;

    // 6. NEUE RecipeTags einfügen
    let mut tags = Vec::new();
    for tag_id in command.tag_ids {
        let recipe_tag = recipe_tag::ActiveModel {
            recipe_id: Set(command.id),
            tag_id: Set(tag_id),
        };

        recipe_tag.insert(&txn).await?;

        let tag_model = tag::Entity::find_by_id(tag_id)
            .one(&txn)
            .await?
            .ok_or_else(|| AppError::NotFound("Tag not found".into()))?;

        tags.push(tag_model.into());
    }

    txn.commit().await?;

    Ok(Recipe::from_existing(
        updated_recipe.id.into(),
        updated_recipe.name,
        serde_json::from_value(updated_recipe.instructions).map_err(|_| AppError::Internal)?,
        ingredients,
        tags,
    ))
}

pub async fn delete_recipe(
    db: &DatabaseConnection,
    command: DeleteRecipeCommand,
) -> Result<(), AppError> {
    recipe::Entity::delete_by_id(command.id).exec(db).await?;

    Ok(())
}

/// Helper functions
// Helper: Ingredients für ein Recipe laden
async fn load_recipe_ingredients(
    db: &impl ConnectionTrait,
    recipe_id: Uuid,
) -> Result<Vec<RecipeIngredient>, AppError> {
    let recipe_ingredient_models = recipe_ingredient::Entity::find()
        .filter(recipe_ingredient::Column::RecipeId.eq(recipe_id))
        .all(db)
        .await?;

    let mut ingredients = Vec::new();
    for ri_model in recipe_ingredient_models {
        let ingredient_model = ingredient::Entity::find_by_id(ri_model.ingredient_id)
            .one(db)
            .await?
            .ok_or_else(|| AppError::NotFound("Ingredient not found".into()))?;

        ingredients.push(RecipeIngredient::from_existing(
            ri_model.id.into(),
            ingredient_model.into(),
            ri_model.amount,
            MeasurementType::from_str(&ri_model.measurement)?,
        ));
    }

    Ok(ingredients)
}

// Helper: Tags für ein Recipe laden
async fn load_recipe_tags(
    db: &impl ConnectionTrait,
    recipe_id: Uuid,
) -> Result<Vec<Tag>, AppError> {
    let tag_ids = recipe_tag::Entity::find()
        .filter(recipe_tag::Column::RecipeId.eq(recipe_id))
        .all(db)
        .await?
        .into_iter()
        .map(|rt| rt.tag_id)
        .collect::<Vec<_>>();

    let tags = tag::Entity::find()
        .filter(tag::Column::Id.is_in(tag_ids))
        .all(db)
        .await?
        .into_iter()
        .map(Into::into)
        .collect();

    Ok(tags)
}
