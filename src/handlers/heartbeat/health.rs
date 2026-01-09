#[utoipa::path(
    get,
    path = "/health",
    tag = "Health",
    responses(
        (status = 200, description = "Service is healthy")
    )
)]
pub async fn health() -> &'static str {
    "OK"
}