use uuid::Uuid;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TagId {
    id: Uuid
}

impl TagId {
    pub(crate) fn new() -> Self {
        TagId {
            id: Uuid::now_v7()
        }
    }

    pub fn value(&self) -> Uuid {
        self.id
    }
}

impl From<Uuid> for TagId {
    fn from(uuid: Uuid) -> Self {
        TagId { id: uuid }
    }
}

impl From<TagId> for Uuid {
    fn from(tag_id: TagId) -> Self {
        tag_id.value()
    }
}