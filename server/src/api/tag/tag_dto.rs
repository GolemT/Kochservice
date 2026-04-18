use crate::domain::tag::tag::Tag;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Deserialize, ToSchema)]
pub struct CreateTagRequest {
    pub name: String,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct UpdateTagRequest {
    pub name: String,
}

#[derive(Serialize, ToSchema)]
pub struct TagResponse {
    pub id: Uuid,
    pub name: String,
}

#[derive(Serialize, ToSchema)]
pub struct TagsResponse {
    pub tags: Vec<TagResponse>,
}

impl From<Tag> for TagResponse {
    fn from(tag: Tag) -> Self {
        TagResponse {
            id: tag.id().value(),
            name: tag.name().to_string(),
        }
    }
}

impl From<Vec<Tag>> for TagsResponse {
    fn from(tags: Vec<Tag>) -> Self {
        TagsResponse {
            tags: tags.into_iter().map(TagResponse::from).collect(),
        }
    }
}
