mod api;
mod application;
mod domain;
mod infrastructure;

use axum::Router;
use axum::http::{HeaderValue, Method};
use axum::routing::{get, post};
use sea_orm::{ConnectOptions, Database};
use sentry::types::Dsn;
use std::str::FromStr;
use std::time::Duration;
use tower_http::cors::CorsLayer;
use utoipa::OpenApi;
use utoipa_scalar::{Scalar, Servable};

use api::heartbeat::health::health;
use api::ingredient::ingredient_handler;
use api::openapi_spec::openapi_spec;
use api::recipe::recipe_handler;
use api::sentry_tunnel::sentry_tunnel_handler;
use api::tag::tag_handler;
use infrastructure::app_state::AppState;
use infrastructure::openapi::ApiDoc;
use infrastructure::seeder::{seed_all, should_seed};
use infrastructure::tracing::init_tracing;
use migration::Migrator;
use sea_orm_migration::MigratorTrait;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load environment variables
    dotenvy::dotenv().ok();
    let database_url =
        std::env::var("DATABASE_URL").expect("Database environmental could not be found");
    let sentry_dsn = std::env::var("SENTRY_DSN").ok();
    let sentry_dsn_client = std::env::var("SENTRY_DSN_CLIENT").ok();
    let deploy_env = std::env::var("DEPLOY_ENV").unwrap_or_else(|_| "development".into());

    let _guard = sentry::init((
        sentry_dsn,
        sentry::ClientOptions {
            release: sentry::release_name!(),
            // Capture user IPs and potentially sensitive headers when using HTTP server integrations
            // see https://docs.sentry.io/platforms/rust/data-management/data-collected for more info
            send_default_pii: false,
            environment: Some(
                std::env::var("DEPLOY_ENV")
                    .unwrap_or_else(|_| "development".into())
                    .into(),
            ),
            ..Default::default()
        },
    ));
    init_tracing();

    let sentry_tunnel_url = sentry_dsn_client
        .and_then(|s| Dsn::from_str(&s).ok())
        .map(|dsn| {
            format!(
                "{}://{}/api/{}/envelope/",
                dsn.scheme(),
                dsn.host(),
                dsn.project_id()
            )
        });

    // Establish database connection
    let mut opt = ConnectOptions::new(&database_url);
    opt.max_connections(100)
        .min_connections(5)
        .connect_timeout(Duration::from_secs(8))
        .acquire_timeout(Duration::from_secs(8))
        .idle_timeout(Duration::from_secs(8))
        .max_lifetime(Duration::from_secs(8))
        .sqlx_logging(false)
        .sqlx_logging_level(log::LevelFilter::Info);
    let db = Database::connect(opt).await?;

    Migrator::up(&db, None).await?;

    if should_seed(&db).await? {
        seed_all(&db).await?;
    }

    // Application State for api
    let app_state = AppState {
        db,
        sentry_tunnel_url,
    };

    let router = Router::new()
        .route("/health", get(health))
        .route("/openapi", get(openapi_spec))
        .route("/sentry_tunnel", post(sentry_tunnel_handler::sentry_tunnel))
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
        .merge(Scalar::with_url("/scalar", ApiDoc::openapi()))
        .layer(
            CorsLayer::new()
                .allow_origin([
                    "http://localhost:3000".parse::<HeaderValue>().unwrap(),
                    "http://localhost:3100".parse::<HeaderValue>().unwrap(),
                    "https://kochservice.golemt.org"
                        .parse::<HeaderValue>()
                        .unwrap(),
                    "https://dev-kochservice.golemt.org"
                        .parse::<HeaderValue>()
                        .unwrap(),
                ])
                .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
                .allow_headers(tower_http::cors::Any),
        );

    tracing::info!("Server running on http://0.0.0.0:8080");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, router).await?;

    Ok(())
}
