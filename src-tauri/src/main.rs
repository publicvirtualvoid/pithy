#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::env;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
#[cfg(debug_assertions)]
fn env() -> String {
    return match env::var("ENV") {
        Ok(val) => val,
        Err(_e) => "none".to_string(),
    };
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![env])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
