use sea_orm::Set;
use crate::domain::entities::tag;
use crate::domain::tag::tag_id::TagId;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Tag {
    id: TagId,
    pub(crate) name: String,
}

impl Tag {
    pub fn new(name: String) -> Tag {
        Tag {
            id: TagId::new(),
            name
        }
    }
    pub fn id(&self) -> &TagId { &self.id }
    pub fn name(&self) -> &str { &self.name }
}

impl From<tag::Model> for Tag {
    fn from(tag: tag::Model) -> Self {
        Tag {
            id: tag.id.into(),
            name: tag.name,
        }
    }
}
impl From<Tag> for tag::ActiveModel {
    fn from(tag: Tag) -> Self {
        tag::ActiveModel {
            id: Set(tag.id.value()),
            name: Set(tag.name)
        }
    }
}