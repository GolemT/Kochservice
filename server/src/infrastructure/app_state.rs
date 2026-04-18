use sea_orm::DatabaseConnection;

#[derive(Clone)]
pub struct AppState {
    pub(crate) db: DatabaseConnection,
    pub sentry_tunnel_url: Option<String>,
}
