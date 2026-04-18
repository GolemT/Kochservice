use crate::api::recipe::recipe_dto::{
    CreateRecipeRequest, GetAllRecipesRequest, RecipeResponse, RecipesResponse, UpdateRecipeRequest,
};
use crate::application::recipe::common::{
    CreateRecipeCommand, DeleteRecipeCommand, GetAllRecipesCommand, GetRecipeCommand,
    UpdateRecipeCommand,
};
use crate::application::recipe::recipe_service;
use crate::infrastructure::app_state::AppState;
use crate::infrastructure::error::AppError;
use axum::{
    Json,
    extract::{Path, Query, State},
};
use uuid::Uuid;

#[utoipa::path(
    post,
    path = "/recipe",
    tag = "Recipes",
    request_body = CreateRecipeRequest,
    responses(
        (status = 201, description = "Create Recipe", body = RecipeResponse),
    )
)]
#[tracing::instrument(skip(app_state))]
pub async fn create_recipe(
    State(app_state): State<AppState>,
    Json(req): Json<CreateRecipeRequest>,
) -> Result<Json<RecipeResponse>, AppError> {
    let command = CreateRecipeCommand {
        name: req.name,
        instructions: req.instructions,
        ingredients: req.ingredients.into_iter().map(Into::into).collect(),
        tag_ids: req.tag_ids,
    };

    let result = recipe_service::create_recipe(&app_state.db, command).await?;
    Ok(Json(result.into()))
}

#[utoipa::path(
    get,
    path = "/recipe",
    tag = "Recipes",
    params(
        ("page" = u64, Query, description = "Page number (0-indexed)"),
        ("page_size" = u64, Query, description = "Items per page")
    ),
    responses(
        (status = 200, description = "Success", body= RecipesResponse),
    )
)]
#[tracing::instrument(skip(app_state))]
pub async fn get_recipes(
    State(app_state): State<AppState>,
    Query(params): Query<GetAllRecipesRequest>,
) -> Result<Json<RecipesResponse>, AppError> {
    let command = GetAllRecipesCommand {
        page: params.page,
        page_size: params.page_size,
    };

    let result = recipe_service::get_all(&app_state.db, command).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    get,
    path = "/recipe/{id}",
    tag = "Recipes",
    responses(
    (status = 200, description = "Found Recipe", body= RecipeResponse),
    )
)]
#[tracing::instrument(skip(app_state))]
pub async fn get_recipe(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<RecipeResponse>, AppError> {
    let command = GetRecipeCommand { id };

    let result = recipe_service::get_recipe(&app_state.db, command).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    put,
    path = "/recipe/{id}",
    tag = "Recipes",
    request_body = UpdateRecipeRequest,
    responses(
        (status = 200, description = "Successfully updated recipe", body = RecipeResponse),
    )
)]
#[tracing::instrument(skip(app_state))]
pub async fn update_recipe(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(req): Json<UpdateRecipeRequest>,
) -> Result<Json<RecipeResponse>, AppError> {
    let command = UpdateRecipeCommand {
        id,
        name: req.name,
        instructions: req.instructions,
        ingredients: req.ingredients.into_iter().map(Into::into).collect(),
        tag_ids: req.tag_ids,
    };

    let result = recipe_service::update_recipe(&app_state.db, command).await?;
    Ok(Json(result.into()))
}

#[utoipa::path(
    delete,
    path = "/recipe/{id}",
    tag = "Recipes",
    responses(
    (status = 200, description = "Deleted Successfully", body= RecipeResponse),
    )
)]
#[tracing::instrument(skip(app_state))]
pub async fn delete_recipe(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<()>, AppError> {
    let command = DeleteRecipeCommand { id };

    recipe_service::delete_recipe(&app_state.db, command).await?;

    Ok(Json(()))
}
