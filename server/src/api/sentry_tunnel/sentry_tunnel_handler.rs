use axum::{body::Bytes, extract::State, http::StatusCode};
use sentry::types::Dsn;
use std::str::FromStr;

use crate::infrastructure::app_state::AppState;
use crate::infrastructure::error::AppError;

#[utoipa::path(
    post,
    path = "/sentry-tunnel",
    tag = "Sentry",
    request_body(
        content = String,
        content_type = "application/x-sentry-envelope",
        description = "Raw Sentry envelope from the browser SDK. Not called directly — the Sentry SDK forwards here automatically when tunnel is configured."
    ),
    responses(
        (status = 200, description = "Envelope forwarded to Sentry successfully"),
        (status = 400, description = "Invalid envelope or DSN project mismatch"),
        (status = 500, description = "Tunnel not configured or Sentry ingest unreachable"),
    )
)]
pub async fn sentry_tunnel(
    State(app_state): State<AppState>,
    body: Bytes,
) -> Result<StatusCode, AppError> {
    let tunnel_url = app_state
        .sentry_tunnel_url
        .as_ref()
        .ok_or(AppError::Internal)?;

    // The Sentry envelope format is newline-delimited.
    // The first line is a JSON header containing the DSN.
    let header_line = body
        .split(|&b| b == b'\n')
        .next()
        .ok_or_else(|| AppError::BadRequest("Invalid envelope".into()))?;

    let header: serde_json::Value = serde_json::from_slice(header_line)
        .map_err(|_| AppError::BadRequest("Invalid envelope header".into()))?;

    let envelope_dsn = header["dsn"]
        .as_str()
        .ok_or_else(|| AppError::BadRequest("Missing DSN in envelope".into()))?;

    // Validate the envelope is destined for our own Sentry project.
    // Prevents this endpoint being abused as an open HTTP proxy.
    let dsn = Dsn::from_str(envelope_dsn)
        .map_err(|_| AppError::BadRequest("Invalid DSN in envelope".into()))?;

    if !tunnel_url.contains(&dsn.project_id().to_string()) {
        return Err(AppError::BadRequest("DSN project mismatch".into()));
    }

    reqwest::Client::new()
        .post(tunnel_url)
        .header("Content-Type", "application/x-sentry-envelope")
        .body(body.to_vec())
        .send()
        .await
        .map_err(|e| {
            tracing::error!(error = %e, "Failed to forward envelope to Sentry");
            AppError::Internal
        })?;

    Ok(StatusCode::OK)
}
