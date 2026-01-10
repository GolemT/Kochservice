use uuid::Uuid;

pub struct IngredientId {
    id: Uuid,
}

impl IngredientId {
    pub fn new() -> Self {
        Self { id: Uuid::now_v7() }
    }

    pub fn value(&self) -> Uuid {
        self.id
    }
}

impl From<Uuid> for IngredientId {
    fn from(uuid: Uuid) -> Self {
        IngredientId { id: uuid }
    }
}

impl From<IngredientId> for Uuid {
    fn from(tag_id: IngredientId) -> Self {
        tag_id.value()
    }
}
