use crate::infrastructure::openapi::ApiDoc;
use axum::Json;
use utoipa::OpenApi;

#[utoipa::path(
    get,
    path = "/health",
    tag = "Health",
    responses(
        (status = 200, description = "Currently Endpoints")
    )
)]
pub async fn openapi_spec() -> Json<utoipa::openapi::OpenApi> {
    Json(ApiDoc::openapi())
}
