use crate::parser::lexer::Lexer;
use crate::parser::node::node_element::NodeElement;
use crate::printer::printable::Printable;

impl Printable for NodeElement {
  fn print(&self, _lexer: &Lexer, _writer: &mut Vec<u8>) -> usize {
    unimplemented!();
  }

  fn len(&self, lexer: &Lexer) -> usize {
    self.sum_attrs(lexer) + self.sum_nodes(lexer)
  }
}

impl NodeElement {
  fn sum_attrs(&self, lexer: &Lexer) -> usize {
    self
      .attrs
      .iter()
      // plus one for the space between attrs
      .fold(0, |prev, cur| prev + cur.len(lexer) + 1)
  }

  fn sum_nodes(&self, lexer: &Lexer) -> usize {
    self
      .childs
      .iter()
      .fold(0, |prev, cur| prev + cur.len(lexer))
  }
}
