use crate::domain::ingredient::ingredient::Ingredient;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, ToSchema)]
pub struct CreateIngredientRequest {
    pub name: String,
}

#[derive(Deserialize, ToSchema)]
pub struct UpdateIngredientRequest {
    pub name: String,
}

#[derive(Serialize, ToSchema)]
pub struct IngredientResponse {
    pub id: Uuid,
    pub name: String,
}

#[derive(Serialize, ToSchema)]
pub struct IngredientsResponse {
    pub ingredients: Vec<IngredientResponse>,
}

impl From<Ingredient> for IngredientResponse {
    fn from(ingredient: Ingredient) -> Self {
        IngredientResponse {
            id: ingredient.id().value(),
            name: ingredient.name().to_string(),
        }
    }
}

impl From<Vec<Ingredient>> for IngredientsResponse {
    fn from(ingredients: Vec<Ingredient>) -> Self {
        IngredientsResponse {
            ingredients: ingredients.into_iter().map(IngredientResponse::from).collect(),
        }
    }
}
