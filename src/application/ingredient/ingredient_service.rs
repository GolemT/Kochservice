use crate::domain::entities::ingredient;
use crate::domain::ingredient::ingredient::Ingredient;
use crate::infrastructure::error::AppError;
use crate::application::ingredient::common::{
    CreateIngredientCommand, DeleteIngredientCommand, GetIngredientCommand, UpdateIngredientCommand,
};
use sea_orm::{ActiveModelTrait, ColumnTrait, Set};
use sea_orm::{DatabaseConnection, EntityTrait, QueryFilter};

pub async fn create_ingredient(
    db: &DatabaseConnection,
    command: CreateIngredientCommand,
) -> Result<Ingredient, AppError> {
    let existing = ingredient::Entity::find()
        .filter(ingredient::Column::Name.eq(&command.name))
        .one(db)
        .await?;

    if existing.is_some() {
        return Err(AppError::Conflict(format!(
            "Ingredient with name '{}' already exists",
            command.name
        )));
    }

    let ingredient = Ingredient::new(command.name);
    let active: ingredient::ActiveModel = ingredient.into();
    let saved = active.insert(db).await?;

    Ok(Ingredient::from(saved))
}

pub async fn get_ingredient(db: &DatabaseConnection, command: GetIngredientCommand) -> Result<Ingredient, AppError> {
    let existing = ingredient::Entity::find()
        .filter(ingredient::Column::Id.eq(command.id))
        .one(db)
        .await?;

    let model = existing
        .ok_or_else(|| AppError::NotFound(format!("Ingredient with id '{}' not found", command.id)))?;

    Ok(Ingredient::from(model))
}

pub async fn get_all(db: &DatabaseConnection) -> Result<Vec<Ingredient>, AppError> {
    let existing = ingredient::Entity::find().all(db).await?;

    Ok(existing.into_iter().map(Ingredient::from).collect())
}

pub async fn update_ingredient(
    db: &DatabaseConnection,
    command: UpdateIngredientCommand,
) -> Result<Ingredient, AppError> {
    let existing = ingredient::Entity::find_by_id(command.id)
        .one(db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Ingredient with id '{}' not found", command.id)))?;

    let mut active: ingredient::ActiveModel = existing.into();
    active.name = Set(command.name);
    let updated = active.update(db).await?;

    Ok(updated.into())
}

pub async fn delete_ingredient(
    db: &DatabaseConnection,
    command: DeleteIngredientCommand,
) -> Result<(), AppError> {
    let existing = ingredient::Entity::find()
        .filter(ingredient::Column::Id.eq(command.id))
        .one(db)
        .await?;

    if existing.is_none() {
        return Err(AppError::NotFound(format!(
            "Ingredient with id '{}' does not exist",
            command.id
        )));
    }

    ingredient::Entity::delete_by_id(command.id).exec(db).await?;

    Ok(())
}
