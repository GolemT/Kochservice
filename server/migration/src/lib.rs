pub use sea_orm_migration::prelude::*;
mod m20260109_193134_create_tags_table;
mod m20260110_110605_create_ingredients_table;
mod m20260110_123044_create_recipes_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260109_193134_create_tags_table::Migration),
            Box::new(m20260110_110605_create_ingredients_table::Migration),
            Box::new(m20260110_123044_create_recipes_table::Migration),
        ]
    }
}
