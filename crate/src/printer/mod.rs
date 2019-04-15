pub mod ast;
pub mod attr;
pub mod node;
pub mod printable;
pub mod tests;
use crate::printer::printable::Printable;
use crate::parser::node::Element;
use crate::parser::AST;
pub(crate) fn print(ast: AST) -> Vec<u8> {
  let mut content: Vec<u8> = Vec::with_capacity(ast.len(&ast.lexer));
  for elm in ast.elms {
    elm.print(&ast.lexer, &mut content);
  }
  content
}

