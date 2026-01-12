use uuid::Uuid;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct RecipeIngredientId {
    id: Uuid,
}

impl RecipeIngredientId {
    pub fn new() -> Self {
        Self { id: Uuid::now_v7() }
    }
    pub fn value(&self) -> Uuid {
        self.id
    }
}

impl From<Uuid> for RecipeIngredientId {
    fn from(uuid: Uuid) -> Self {
        RecipeIngredientId { id: uuid }
    }
}

impl From<RecipeIngredientId> for Uuid {
    fn from(recipe_ingredient_id: RecipeIngredientId) -> Self {
        recipe_ingredient_id.value()
    }
}
