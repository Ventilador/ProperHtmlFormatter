use crate::parser::lexer::Lexer;
pub trait Printable {
  fn print(&self, lexer: &Lexer, buffer: &mut Vec<u8>) -> usize;
  fn len(&self, lexer: &Lexer) -> usize;
}
