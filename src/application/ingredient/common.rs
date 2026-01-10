use uuid::Uuid;

pub struct CreateIngredientCommand {
    pub name: String,
}

pub struct GetIngredientCommand {
    pub id: Uuid,
}

pub struct UpdateIngredientCommand {
    pub id: Uuid,
    pub name: String,
}

pub struct DeleteIngredientCommand {
    pub id: Uuid,
}
