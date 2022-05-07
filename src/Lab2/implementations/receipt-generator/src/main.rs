use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Request, Response, Server};
use std::{convert::Infallible, env, net::SocketAddr, collections::HashMap};
mod types;
extern crate dotenv;
use dotenv::dotenv;
use log::{error, info, warn};

const SERVER_PORT: u16 = 8081;
const SERVER_HOST: [u8; 4] = [127, 0, 0, 1];


async fn mail_receipt()-> types::Result<bool> {
    let mail_service_url: String = String::from("http://localhost:3500/v1.0/bindings/mailing");
    let client = reqwest::Client::new();

    // Prepare mail body, using a map as a json substitute
    let mut json = HashMap::new();
    json.insert("body", "rust");
    json.insert("to", "json");

    let res = client.post(mail_service_url).json(&json).send().await?;
    if res.status().is_success(){
        info!("Successfully sent mail")
    }
    else {
        warn!("Couldn't send mail")
    }
    Ok(true)
}

/// Search and return a random cat image
async fn generate_receipt(_req: Request<Body>) -> types::Result<Response<Body>> {
    mail_receipt().await?;
    Ok(Response::new("Ok".into()))
}



#[tokio::main]
async fn main() {
    env_logger::init();
    dotenv().ok();
    info!("Now starting server !");

    // Boot up the server, SERVER_PORT should always be available, this is running in a
    // container
    let socket = SocketAddr::from((SERVER_HOST, SERVER_PORT));
    // Server handler
    let handler =
        make_service_fn(|_conn| async { Ok::<_, Infallible>(service_fn(generate_receipt)) });
    let server = Server::bind(&socket).serve(handler);
    info!("Server listening to {:?}:{} !", SERVER_HOST, SERVER_PORT);

    // Run the server until
    if let Err(e) = server.await {
        error!("Server error: {}", e);
        panic!();
    }
}
