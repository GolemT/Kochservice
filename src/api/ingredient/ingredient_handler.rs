use crate::api::ingredient::ingredient_dto::{
    CreateIngredientRequest, IngredientResponse, IngredientsResponse, UpdateIngredientRequest,
};
use crate::application::ingredient::common::{
    CreateIngredientCommand, DeleteIngredientCommand, GetIngredientCommand, UpdateIngredientCommand,
};
use crate::application::ingredient::ingredient_service;
use crate::infrastructure::app_state::AppState;
use crate::infrastructure::error::AppError;
use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

#[utoipa::path(
    post,
    path = "/ingredient",
    tag = "Ingredients",
    request_body = CreateIngredientRequest,
    responses(
    (status = 201, description = "Create Ingredient", body= IngredientResponse),
    )
)]
pub async fn create_ingredient(
    State(app_state): State<AppState>,
    Json(req): Json<CreateIngredientRequest>,
) -> Result<Json<IngredientResponse>, AppError> {
    let command = CreateIngredientCommand { name: req.name };

    let result = ingredient_service::create_ingredient(&app_state.db, command).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    get,
    path = "/ingredient",
    tag = "Ingredients",
    responses(
    (status = 200, description = "Success", body= IngredientsResponse),
    )
)]
pub async fn get_ingredients(
    State(app_state): State<AppState>,
) -> Result<Json<IngredientsResponse>, AppError> {
    let result = ingredient_service::get_all(&app_state.db).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    get,
    path = "/ingredient/{id}",
    tag = "Ingredients",
    responses(
    (status = 200, description = "Found Ingredient", body= IngredientResponse),
    )
)]
pub async fn get_ingredient(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<IngredientResponse>, AppError> {
    let command = GetIngredientCommand { id };

    let result = ingredient_service::get_ingredient(&app_state.db, command).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    put,
    path = "/ingredient/{id}",
    tag = "Ingredients",
    request_body = UpdateIngredientRequest,
    responses(
    (status = 200, description = "Successfully updated ingredient", body= IngredientResponse),
    )
)]
pub async fn update_ingredient(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(req): Json<UpdateIngredientRequest>,
) -> Result<Json<IngredientResponse>, AppError> {
    let command = UpdateIngredientCommand { id, name: req.name };

    let result = ingredient_service::update_ingredient(&app_state.db, command).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    delete,
    path = "/ingredient/{id}",
    tag = "Ingredients",
    responses(
    (status = 200, description = "Deleted Successfully", body= IngredientResponse),
    )
)]
pub async fn delete_ingredient(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<()>, AppError> {
    let command = DeleteIngredientCommand { id };

    ingredient_service::delete_ingredient(&app_state.db, command).await?;

    Ok(Json(()))
}
