#![allow(dead_code, unused_imports)]
mod formatter;
mod parser;
mod printer;
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
pub fn format(html: &str) -> Result<Vec<u8>, parser::errors::LexerError> {
  let ast = parser::parse(html.as_bytes())?;

  Ok(printer::print(ast))
}

#[test]
pub fn format_test() {
  let mut ast = parser::parse(
    b"<div></div>
",
  )
  .expect("could not parse html");
  ast = formatter::Formatter::friendly().parse(ast);
  assert_eq!(
    printer::print(ast),
    b"<div></div>
"
  )
}
