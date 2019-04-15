pub mod node_element;
pub mod text;
use super::printable::Printable;
use crate::parser::attr::Attribute;
use crate::parser::attr::FullAttr;
use crate::parser::context::Context;
use crate::parser::lexer::Lexer;
use crate::parser::node::Element;
use crate::parser::node::NodeElement;
use crate::parser::*;

impl Printable for Element {
  fn print(&self, _lexer: &Lexer, _writer: &mut Vec<u8>) -> usize {
    unimplemented!();
  }

  fn len(&self, lexer: &Lexer) -> usize {
    match self {
      Element::NewLine(_) => 2,
      Element::Text(context) => context.len(lexer),
      Element::Node(node) => node.len(lexer),
    }
  }
}

impl Printable for Context {
  fn print(&self, _lexer: &Lexer, _writer: &mut Vec<u8>) -> usize {
    unimplemented!();
  }

  fn len(&self, _lexer: &Lexer) -> usize {
    unimplemented!();
  }
}
