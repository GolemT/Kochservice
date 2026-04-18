pub(crate) use crate::domain::recipe::recipe_id::RecipeId;
use crate::domain::recipe_ingredient::recipe_ingredient::RecipeIngredient;
use crate::domain::tag::tag::Tag;

pub struct Recipe {
    id: RecipeId,
    name: String,
    instructions: Vec<String>,
    ingredients: Vec<RecipeIngredient>,
    tags: Vec<Tag>,
}

impl Recipe {
    pub fn new(
        name: String,
        instructions: Vec<String>,
        ingredients: Vec<RecipeIngredient>,
        tags: Vec<Tag>,
    ) -> Recipe {
        Self {
            id: RecipeId::new(),
            name,
            instructions,
            ingredients,
            tags,
        }
    }

    pub fn from_existing(
        id: RecipeId,
        name: String,
        instructions: Vec<String>,
        ingredients: Vec<RecipeIngredient>,
        tags: Vec<Tag>,
    ) -> Recipe {
        Self {
            id,
            name,
            instructions,
            ingredients,
            tags,
        }
    }

    pub fn id(&self) -> RecipeId {
        self.id.clone()
    }
    pub fn name(&self) -> &str {
        &self.name
    }
    pub fn instructions(&self) -> &[String] {
        &self.instructions
    }
    pub fn ingredients(&self) -> &[RecipeIngredient] {
        &self.ingredients
    }
    pub fn tags(&self) -> &[Tag] {
        &self.tags
    }
}
