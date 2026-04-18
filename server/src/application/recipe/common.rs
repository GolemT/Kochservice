use crate::domain::recipe_ingredient::recipe_ingredient::MeasurementType;
use uuid::Uuid;

pub struct CreateRecipeCommand {
    pub name: String,
    pub instructions: Vec<String>,
    pub ingredients: Vec<RecipeIngredientData>,
    pub tag_ids: Vec<Uuid>,
}

pub struct RecipeIngredientData {
    pub ingredient_id: Uuid,
    pub amount: f32,
    pub measurement: MeasurementType,
}

pub struct GetRecipeCommand {
    pub id: Uuid,
}

pub struct GetAllRecipesCommand {
    pub page: u64,
    pub page_size: u64,
}

pub struct UpdateRecipeCommand {
    pub id: Uuid,
    pub name: String,
    pub tag_ids: Vec<Uuid>,
    pub ingredients: Vec<RecipeIngredientData>,
    pub instructions: Vec<String>,
}

pub struct DeleteRecipeCommand {
    pub id: Uuid,
}
