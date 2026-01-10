mod api;
mod application;
mod domain;
mod infrastructure;

use axum::Router;
use axum::routing::get;
use sea_orm::{ConnectOptions, Database};
use std::time::Duration;
use utoipa::OpenApi;
use utoipa_scalar::{Scalar, Servable};

use api::heartbeat::health::health;
use api::ingredient::ingredient_handler;
use api::openapi_spec::openapi_spec;
use api::recipe::recipe_handler;
use api::tag::tag_handler;
use infrastructure::app_state::AppState;
use infrastructure::openapi::ApiDoc;
use migration::Migrator;
use sea_orm_migration::MigratorTrait;

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

    Migrator::up(&db, None).await?;

    // Application State for api
    let app_state = AppState { db };

    let router = Router::new()
        .route("/health", get(health))
        .route("/openapi", get(openapi_spec))
        .route(
            "/recipe",
            get(recipe_handler::get_recipes).post(recipe_handler::create_recipe),
        )
        .route(
            "/recipe/{id}",
            get(recipe_handler::get_recipe)
                .delete(recipe_handler::delete_recipe)
                .put(recipe_handler::update_recipe),
        )
        .route(
            "/ingredient",
            get(ingredient_handler::get_ingredients).post(ingredient_handler::create_ingredient),
        )
        .route(
            "/ingredient/{id}",
            get(ingredient_handler::get_ingredient)
                .delete(ingredient_handler::delete_ingredient)
                .put(ingredient_handler::update_ingredient),
        )
        .route(
            "/tag",
            get(tag_handler::get_tags).post(tag_handler::create_tag),
        )
        .route(
            "/tag/{id}",
            get(tag_handler::get_tag)
                .delete(tag_handler::delete_tag)
                .put(tag_handler::update_tag),
        )
        .with_state(app_state)
        .merge(Scalar::with_url("/scalar", ApiDoc::openapi()));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, router).await?;

    println!("Server running on http://127.0.0.1:8080");
    println!("Scalar UI at http://127.0.0.1:8080/scalar");

    // Closing connection here
    let db = Database::connect(&database_url).await?;
    db.close().await?;

    Ok(())
}
