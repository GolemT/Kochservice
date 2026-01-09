use crate::handlers::tag::tag_dto::{
    CreateTagRequest, TagResponse, TagsResponse, UpdateTagRequest,
};
use crate::infrastructure::app_state::AppState;
use crate::infrastructure::error::AppError;
use crate::services::tag::common::{
    CreateTagCommand, DeleteTagCommand, GetTagCommand, UpdateTagCommand,
};
use crate::services::tag::tag_service;
use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

#[utoipa::path(
    post,
    path = "/tag",
    tag = "Tags",
    request_body = CreateTagRequest,
    responses(
    (status = 201, description = "Create Tag", body= TagResponse),
    )
)]
pub async fn create_tag(
    State(app_state): State<AppState>,
    Json(req): Json<CreateTagRequest>,
) -> Result<Json<TagResponse>, AppError> {
    let command = CreateTagCommand { name: req.name };

    let result = tag_service::create_tag(&app_state.db, command).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    get,
    path = "/tag",
    tag = "Tags",
    responses(
    (status = 200, description = "Success", body= TagsResponse),
    )
)]
pub async fn get_tags(State(app_state): State<AppState>) -> Result<Json<TagsResponse>, AppError> {
    let result = tag_service::get_all(&app_state.db).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    get,
    path = "/tag/{id}",
    tag = "Tags",
    responses(
    (status = 200, description = "Found Tag", body= TagResponse),
    )
)]
pub async fn get_tag(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<TagResponse>, AppError> {
    let command = GetTagCommand { id };

    let result = tag_service::get_tag(&app_state.db, command).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    put,
    path = "/tag/{id}",
    tag = "Tags",
    request_body = UpdateTagRequest,
    responses(
    (status = 200, description = "Successfully updated tag", body= TagResponse),
    )
)]
pub async fn update_tag(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(req): Json<UpdateTagRequest>,
) -> Result<Json<TagResponse>, AppError> {
    let command = UpdateTagCommand { id, name: req.name };

    let result = tag_service::update_tag(&app_state.db, command).await?;

    Ok(Json(result.into()))
}

#[utoipa::path(
    delete,
    path = "/tag/{id}",
    tag = "Tags",
    responses(
    (status = 200, description = "Deleted Successfully", body= TagResponse),
    )
)]
pub async fn delete_tag(
    State(app_state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<()>, AppError> {
    let command = DeleteTagCommand { id };

    tag_service::delete_tag(&app_state.db, command).await?;

    Ok(Json(()))
}
