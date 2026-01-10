use crate::domain::entities::tag;
use crate::domain::tag::tag::Tag;
use crate::infrastructure::error::AppError;
use crate::application::tag::common::{
    CreateTagCommand, DeleteTagCommand, GetTagCommand, UpdateTagCommand,
};
use sea_orm::{ActiveModelTrait, ColumnTrait, Set};
use sea_orm::{DatabaseConnection, EntityTrait, QueryFilter};

pub async fn create_tag(
    db: &DatabaseConnection,
    command: CreateTagCommand,
) -> Result<Tag, AppError> {
    let existing = tag::Entity::find()
        .filter(tag::Column::Name.eq(&command.name))
        .one(db)
        .await?;

    if existing.is_some() {
        return Err(AppError::Conflict(format!(
            "Tag with name '{}' already exists",
            command.name
        )));
    }

    let tag = Tag::new(command.name);
    let active: tag::ActiveModel = tag.into();
    let saved = active.insert(db).await?;

    Ok(Tag::from(saved))
}

pub async fn get_tag(db: &DatabaseConnection, command: GetTagCommand) -> Result<Tag, AppError> {
    let existing = tag::Entity::find()
        .filter(tag::Column::Id.eq(command.id))
        .one(db)
        .await?;

    let model = existing
        .ok_or_else(|| AppError::NotFound(format!("Tag with id '{}' not found", command.id)))?;

    Ok(Tag::from(model))
}

pub async fn get_all(db: &DatabaseConnection) -> Result<Vec<Tag>, AppError> {
    let existing = tag::Entity::find().all(db).await?;

    Ok(existing.into_iter().map(Tag::from).collect())
}

pub async fn update_tag(
    db: &DatabaseConnection,
    command: UpdateTagCommand,
) -> Result<Tag, AppError> {
    let existing = tag::Entity::find_by_id(command.id)
        .one(db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Tag with id '{}' not found", command.id)))?;

    let mut active: tag::ActiveModel = existing.into();
    active.name = Set(command.name);
    let updated = active.update(db).await?;

    Ok(updated.into())
}

pub async fn delete_tag(
    db: &DatabaseConnection,
    command: DeleteTagCommand,
) -> Result<(), AppError> {
    let existing = tag::Entity::find()
        .filter(tag::Column::Id.eq(command.id))
        .one(db)
        .await?;

    if existing.is_none() {
        return Err(AppError::NotFound(format!(
            "Tag with id '{}' does not exist",
            command.id
        )));
    }

    tag::Entity::delete_by_id(command.id).exec(db).await?;

    Ok(())
}
