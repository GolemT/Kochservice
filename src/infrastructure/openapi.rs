use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(
        crate::handlers::heartbeat::health::health,
        crate::handlers::tag::tag_handler::create_tag,
        crate::handlers::tag::tag_handler::get_tags,
        crate::handlers::tag::tag_handler::get_tag,
        crate::handlers::tag::tag_handler::update_tag,
        crate::handlers::tag::tag_handler::delete_tag,
    ),
    tags(
        (name = "Tags", description = "Tag management endpoints"),
        (name = "Health", description = "Health check endpoints")
    ),
    components(
        schemas(
            crate::handlers::tag::tag_dto::CreateTagRequest,
            crate::handlers::tag::tag_dto::UpdateTagRequest,
            crate::handlers::tag::tag_dto::TagResponse,
            crate::handlers::tag::tag_dto::TagsResponse,
        )
    )
)]
pub struct ApiDoc;
