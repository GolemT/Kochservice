use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Recipe Tabelle
        manager
            .create_table(
                Table::create()
                    .table(Recipe::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Recipe::Id).uuid().not_null().primary_key())
                    .col(
                        ColumnDef::new(Recipe::Name)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(Recipe::Instructions).json().not_null())
                    .to_owned(),
            )
            .await?;

        // RecipeIngredient Junction Tabelle
        manager
            .create_table(
                Table::create()
                    .table(RecipeIngredient::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RecipeIngredient::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(RecipeIngredient::RecipeId).uuid().not_null())
                    .col(
                        ColumnDef::new(RecipeIngredient::IngredientId)
                            .uuid()
                            .not_null(),
                    )
                    .col(ColumnDef::new(RecipeIngredient::Amount).float().not_null())
                    .col(
                        ColumnDef::new(RecipeIngredient::Measurement)
                            .string()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_recipe_ingredient_recipe")
                            .from(RecipeIngredient::Table, RecipeIngredient::RecipeId)
                            .to(Recipe::Table, Recipe::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_recipe_ingredient_ingredient")
                            .from(RecipeIngredient::Table, RecipeIngredient::IngredientId)
                            .to(Ingredient::Table, Ingredient::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // RecipeTag Junction Tabelle
        manager
            .create_table(
                Table::create()
                    .table(RecipeTag::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(RecipeTag::RecipeId).uuid().not_null())
                    .col(ColumnDef::new(RecipeTag::TagId).uuid().not_null())
                    .primary_key(
                        Index::create()
                            .col(RecipeTag::RecipeId)
                            .col(RecipeTag::TagId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_recipe_tag_recipe")
                            .from(RecipeTag::Table, RecipeTag::RecipeId)
                            .to(Recipe::Table, Recipe::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_recipe_tag_tag")
                            .from(RecipeTag::Table, RecipeTag::TagId)
                            .to(Tag::Table, Tag::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RecipeTag::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(RecipeIngredient::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Recipe::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Recipe {
    Table,
    Id,
    Name,
    Instructions,
}

#[derive(DeriveIden)]
enum RecipeIngredient {
    Table,
    Id,
    RecipeId,
    IngredientId, // Nicht "Ingredient"!
    Amount,
    Measurement,
}

#[derive(DeriveIden)]
enum RecipeTag {
    Table,
    RecipeId,
    TagId,
}

// Referenzen für Foreign Keys
#[derive(DeriveIden)]
enum Tag {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Ingredient {
    Table,
    Id,
}
