mod infrastructure;
mod handlers;
mod domain;
mod services;

use std::time::Duration;
use axum::Router;
use axum::routing::{get};
use sea_orm::{ConnectOptions, Database};
use utoipa::OpenApi;
use utoipa_scalar::{Scalar, Servable};

use crate::infrastructure::app_state::AppState;
use crate::infrastructure::openapi::ApiDoc;
use handlers::heartbeat::health::health;
use crate::handlers::tag::tag_handler;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    // Load environment variables
    dotenvy::dotenv().ok();
    let database_url = std::env::var("DATABASE_URL")?;

    // Establish database connection
    let mut opt = ConnectOptions::new(&database_url);
    opt.max_connections(100)
        .min_connections(5)
        .connect_timeout(Duration::from_secs(8))
        .acquire_timeout(Duration::from_secs(8))
        .idle_timeout(Duration::from_secs(8))
        .max_lifetime(Duration::from_secs(8))
        .sqlx_logging(false) // disable SQLx logging
        .sqlx_logging_level(log::LevelFilter::Info);
    let db = Database::connect(opt).await?;

    // Application State for handlers
    let app_state = AppState {db};

    let router = Router::new()
        .route("/health", get(health))
        // .route("/recipe", get(get_users).post(create_user))
        // .route("/recipe/{id}", get(get_user).delete(delete_user))
        //
        // .route("/ingredient", get(get_ingredients).post(create_ingredient))
        // .route("/ingredient/{id}", get(get_ingredient).delete(delete_ingredient))
        //
        .route("/tag", get(tag_handler::get_tags).post(tag_handler::create_tag))
        .route("/tag/{id}", get(tag_handler::get_tag).delete(tag_handler::delete_tag).put(tag_handler::update_tag))
        .with_state(app_state)
        .merge(Scalar::with_url("/scalar", ApiDoc::openapi()));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, router).await?;

    println!("Server running on http://127.0.0.1:3000");
    println!("Scalar UI at http://127.0.0.1:3000/scalar");

    // Closing connection here
    let db = Database::connect(&database_url).await?;
    db.close().await?;

    Ok(())
}
