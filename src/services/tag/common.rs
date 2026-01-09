use uuid::Uuid;

pub struct CreateTagCommand {
    pub name: String
}

pub struct GetTagCommand {
    pub id: Uuid
}

pub struct GetTagsCommand {}

pub struct UpdateTagCommand {
    pub id: Uuid,
    pub name: String,
}

pub struct DeleteTagCommand {
    pub id: Uuid
}
