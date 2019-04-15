use crate::parser::lexer::Lexer;
use crate::parser::AST;
use crate::printer::printable::Printable;

impl<'a> Printable for AST<'a> {
  fn print(&self, _lexer: &Lexer, _writer: &mut Vec<u8>) -> usize {
    unimplemented!();
  }
  fn len(&self, lexer: &Lexer) -> usize {
    self.elms.iter().fold(0, |prev, cur| prev + cur.len(lexer))
  }
}
