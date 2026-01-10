use crate::domain::entities::ingredient;
pub(crate) use crate::domain::ingredient::ingredient_id::IngredientId;
use sea_orm::Set;

pub struct Ingredient {
    id: IngredientId,
    name: String,
}

impl Ingredient {
    pub fn new(name: String) -> Self {
        Self {
            id: IngredientId::new(),
            name,
        }
    }

    pub fn id(&self) -> &IngredientId {
        &self.id
    }
    pub fn name(&self) -> &str {
        &self.name
    }
}

impl From<ingredient::Model> for Ingredient {
    fn from(ingredient: ingredient::Model) -> Self {
        Ingredient {
            id: ingredient.id.into(),
            name: ingredient.name,
        }
    }
}
impl From<Ingredient> for ingredient::ActiveModel {
    fn from(ingredient: Ingredient) -> Self {
        ingredient::ActiveModel {
            id: Set(ingredient.id.value()),
            name: Set(ingredient.name),
        }
    }
}
