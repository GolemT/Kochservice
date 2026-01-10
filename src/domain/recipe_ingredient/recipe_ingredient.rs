use crate::domain::ingredient::ingredient::Ingredient;
use crate::domain::recipe_ingredient::recipe_ingredient_id::RecipeIngredientId;
use std::fmt::Display;

pub struct RecipeIngredient {
    id: RecipeIngredientId,
    ingredient: Ingredient,
    amount: f32,
    measurement: MeasurementType,
}

impl RecipeIngredient {
    pub fn new(ingredient: Ingredient, amount: f32, measurement: MeasurementType) -> Self {
        Self {
            id: RecipeIngredientId::new(),
            ingredient,
            amount,
            measurement,
        }
    }
    pub fn from_existing(
        id: RecipeIngredientId,
        ingredient: Ingredient,
        amount: f32,
        measurement: MeasurementType,
    ) -> Self {
        Self {
            id,
            ingredient,
            amount,
            measurement,
        }
    }

    pub fn id(&self) -> &RecipeIngredientId {
        &self.id
    }
    pub fn ingredient(&self) -> &Ingredient {
        &self.ingredient
    }
    pub fn amount(&self) -> f32 {
        self.amount
    }
    pub fn measurement(&self) -> &MeasurementType {
        &self.measurement
    }
}

pub enum MeasurementType {
    Ml,
    G,
    Tablespoon,
}

use crate::infrastructure::error::AppError;
use std::str::FromStr;

impl FromStr for MeasurementType {
    type Err = AppError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Ml" => Ok(MeasurementType::Ml),
            "G" => Ok(MeasurementType::G),
            "Tablespoon" => Ok(MeasurementType::Tablespoon),
            _ => Err(AppError::BadRequest(format!(
                "Invalid measurement type: {}",
                s
            ))),
        }
    }
}

impl Display for MeasurementType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            MeasurementType::Ml => "Ml",
            MeasurementType::G => "G",
            MeasurementType::Tablespoon => "Tablespoon",
        }
        .to_string();
        write!(f, "{}", str)
    }
}
