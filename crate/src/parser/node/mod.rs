pub mod new_line;
pub mod node_element;
pub mod text;

use crate::parser::context::Context;
pub use crate::parser::errors::LexerError;
use crate::parser::lexer::Lexer;
pub use crate::parser::node::new_line::NewLine;
pub use crate::parser::node::node_element::NodeElement;
pub use crate::parser::node::text::TextLine;

#[derive(Debug)]
pub enum Element {
  Text(TextLine),
  Node(NodeElement),
  NewLine(NewLine),
}

impl Element {
  pub fn to_string(self) -> String {
    unimplemented!();
  }
  pub fn parse(lexer: &mut Lexer) -> Result<Vec<Element>, LexerError> {
    let mut elms = vec![];
    while lexer.more() {
      let context = lexer.start_context();
      match lexer.get() {
        b'<' => {
          // closing tag gets handled by parent
          if lexer.next_is(b'/') {
            lexer.move_next();
            lexer.move_next();
            return Ok(elms);
          }
          // if opening tag next char is space, its a wrong formed tag, return err
          if lexer.next_is_nonword() {
            return Err(LexerError::InvalidSpace(lexer.end_context(context)));
          } else {
            // create tag
            lexer.move_next();
            elms.push(Element::Node(
              NodeElement::parse(lexer).expect("Could not parse node"),
            ));
          }
        }
        b'\r' => {
          if lexer.next_is(b'\n') {
            if lexer.walked(&context) {
              elms.push(Element::Text(TextLine::new(lexer, context)));
              lexer.move_next();
              elms.push(Element::NewLine(NewLine::new(lexer)));
            } else {
              elms.push(Element::NewLine(NewLine::from(lexer, context)));
            }
          }
        }
        b'\n' => {
          if lexer.walked(&context) {
            elms.push(Element::Text(TextLine::new(lexer, context)));
          } else {
            elms.push(Element::NewLine(NewLine::from(lexer, context)));
          }
        }
        _ => {
          lexer.move_next();
        }
      }
    }

    Ok(elms)
  }
}
