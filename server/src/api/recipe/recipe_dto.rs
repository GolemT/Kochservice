use crate::domain::recipe::recipe::Recipe;
use crate::domain::recipe_ingredient::recipe_ingredient::{MeasurementType, RecipeIngredient};
use crate::domain::tag::tag::Tag;
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Deserialize, ToSchema)]
pub struct CreateRecipeRequest {
    pub name: String,
    pub instructions: Vec<String>,
    pub ingredients: Vec<RecipeIngredientDto>,
    pub tag_ids: Vec<Uuid>,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct UpdateRecipeRequest {
    pub name: String,
    pub instructions: Vec<String>,
    pub ingredients: Vec<RecipeIngredientDto>,
    pub tag_ids: Vec<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct GetAllRecipesRequest {
    pub page: u64,
    pub page_size: u64,
}

#[derive(Serialize, ToSchema)]
pub struct RecipeResponse {
    pub id: Uuid,
    pub name: String,
    pub instructions: Vec<String>,
    pub ingredients: Vec<RecipeIngredientResponse>,
    pub tags: Vec<TagResponse>, // Du brauchst auch TagResponse!
}

#[derive(Serialize, ToSchema)]
pub struct TagResponse {
    pub id: Uuid,
    pub name: String,
}

#[derive(Serialize, ToSchema)]
pub struct RecipesResponse {
    pub recipes: Vec<RecipeResponse>,
    pub total_pages: u64,
}

// Konvertierungen
impl From<RecipeIngredientDto> for crate::application::recipe::common::RecipeIngredientData {
    fn from(dto: RecipeIngredientDto) -> Self {
        Self {
            ingredient_id: dto.ingredient_id,
            amount: dto.amount,
            measurement: MeasurementType::from_str(&dto.measurement).unwrap(), // Validierung im Handler!
        }
    }
}

impl From<RecipeIngredient> for RecipeIngredientResponse {
    fn from(ri: RecipeIngredient) -> Self {
        Self {
            id: ri.id().value(),
            ingredient_id: ri.ingredient().id().value(),
            ingredient_name: ri.ingredient().name().to_string(),
            amount: ri.amount(),
            measurement: ri.measurement().to_string(),
        }
    }
}

impl From<Tag> for TagResponse {
    fn from(tag: Tag) -> Self {
        Self {
            id: tag.id().value(),
            name: tag.name().to_string(),
        }
    }
}

impl From<(Vec<Recipe>, u64)> for RecipesResponse {
    fn from(data: (Vec<Recipe>, u64)) -> Self {
        RecipesResponse {
            recipes: data.0.into_iter().map(Into::into).collect(),
            total_pages: data.1,
        }
    }
}

impl From<&RecipeIngredient> for RecipeIngredientResponse {
    fn from(ri: &RecipeIngredient) -> Self {
        Self {
            id: ri.id().value(),
            ingredient_id: ri.ingredient().id().value(),
            ingredient_name: ri.ingredient().name().to_string(),
            amount: ri.amount(),
            measurement: ri.measurement().to_string(),
        }
    }
}

impl From<&Tag> for TagResponse {
    fn from(tag: &Tag) -> Self {
        Self {
            id: tag.id().value(),
            name: tag.name().to_string(),
        }
    }
}

impl From<Recipe> for RecipeResponse {
    fn from(recipe: Recipe) -> Self {
        RecipeResponse {
            id: recipe.id().value(),
            name: recipe.name().to_string(),
            instructions: Vec::from(recipe.instructions()),
            ingredients: recipe.ingredients().iter().map(Into::into).collect(),
            tags: recipe.tags().iter().map(Into::into).collect(),
        }
    }
}

// DTO für Ingredient-Daten im Request
#[derive(Debug, Deserialize, Serialize, ToSchema, Clone)]
pub struct RecipeIngredientDto {
    pub ingredient_id: Uuid,
    pub amount: f32,
    pub measurement: String, // "Ml", "G", "Tablespoon"
}

// DTO für Ingredient-Daten in Response
#[derive(Serialize, ToSchema)]
pub struct RecipeIngredientResponse {
    pub id: Uuid,
    pub ingredient_id: Uuid,
    pub ingredient_name: String,
    pub amount: f32,
    pub measurement: String,
}
