use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(
        crate::api::heartbeat::health::health,
        crate::api::tag::tag_handler::create_tag,
        crate::api::tag::tag_handler::get_tags,
        crate::api::tag::tag_handler::get_tag,
        crate::api::tag::tag_handler::update_tag,
        crate::api::tag::tag_handler::delete_tag,
        crate::api::ingredient::ingredient_handler::create_ingredient,
        crate::api::ingredient::ingredient_handler::get_ingredients,
        crate::api::ingredient::ingredient_handler::get_ingredient,
        crate::api::ingredient::ingredient_handler::update_ingredient,
        crate::api::ingredient::ingredient_handler::delete_ingredient,
    ),
    tags(
        (name = "Ingredients", description = "Ingredient management endpoints"),
        (name = "Tags", description = "Tag management endpoints"),
        (name = "Health", description = "Health check endpoints")
    ),
    components(
        schemas(
            crate::api::tag::tag_dto::CreateTagRequest,
            crate::api::tag::tag_dto::UpdateTagRequest,
            crate::api::tag::tag_dto::TagResponse,
            crate::api::tag::tag_dto::TagsResponse,
            crate::api::ingredient::ingredient_dto::CreateIngredientRequest,
            crate::api::ingredient::ingredient_dto::UpdateIngredientRequest,
            crate::api::ingredient::ingredient_dto::IngredientResponse,
            crate::api::ingredient::ingredient_dto::IngredientsResponse,
        )
    )
)]
pub struct ApiDoc;
