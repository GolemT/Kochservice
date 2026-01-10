use uuid::Uuid;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct RecipeId {
    id: Uuid,
}

impl RecipeId {
    pub fn new() -> Self {
        Self { id: Uuid::now_v7() }
    }

    pub fn value(&self) -> Uuid {
        self.id
    }
}

impl From<Uuid> for RecipeId {
    fn from(uuid: Uuid) -> Self {
        RecipeId { id: uuid }
    }
}

impl From<RecipeId> for Uuid {
    fn from(recipe_id: RecipeId) -> Self {
        recipe_id.value()
    }
}
