use crate::parser::lexer::Lexer;
use crate::parser::node::text::TextLine;
use crate::printer::printable::Printable;

impl Printable for TextLine {
  fn print(&self, lexer: &Lexer, writer: &mut Vec<u8>) -> usize {
    self.context.print(lexer, writer)
  }

  fn len(&self, lexer: &Lexer) -> usize {
    self.context.len(lexer)
  }
}
