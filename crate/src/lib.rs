#![allow(dead_code, unused_imports)]
mod parser;
use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;

cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
        use wee_alloc::WeeAlloc;
        #[global_allocator]
        static ALLOC: WeeAlloc = WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
pub fn format(_html: &str) -> Result<Vec<u8>, std::io::Error> {
  unimplemented!();
}
