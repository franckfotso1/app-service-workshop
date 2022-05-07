// Dynamic error type, can contain any error.
pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync>>;
