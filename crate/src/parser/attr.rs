use super::context::Context;
use super::errors::LexerError;
use super::lexer::Lexer;
use crate::parser::node::node_element::NodeElement;
use std::cell::RefCell;
use std::rc::Rc;
#[derive(Debug)]
pub struct FullAttr {
  pub parent_node: Rc<RefCell<NodeElement>>,
  pub name: Context,
  pub value: Context,
  pub context: Context,
}

impl FullAttr {
  fn parse(
    lexer: &mut Lexer,
    context: Context,
    name: Context,
    parent: Rc<RefCell<NodeElement>>,
  ) -> Self {
    let value_context = lexer.start_context();
    let quote_type = lexer.get();
    lexer.move_next();
    lexer.skip_until(|c| c == quote_type);
    FullAttr {
      parent_node: parent.clone(),
      name,
      value: lexer.end_context_stay(value_context),
      context: lexer.end_context(context),
    }
  }
}

#[derive(Debug)]
pub enum Attribute {
  FullAttr(FullAttr),
  NameOnly(Context),
  NewLine,
}

impl Attribute {
  pub fn parse(
    lexer: &mut Lexer,
    parent: Rc<RefCell<NodeElement>>,
  ) -> Result<Vec<Self>, LexerError> {
    // short end
    if lexer.get() == b'>' {
      lexer.move_next();
      return Ok(vec![]);
    }
    let mut attrs: Vec<Attribute> = Vec::new();
    while lexer.more() {
      lexer.skip(b' ');
      match lexer.get() {
        // maybe self closing tag
        b'/' => {
          lexer.move_next();
          // success close tag
          if lexer.get() == b'>' {
            lexer.move_next();
            break;
          }
          // invalid char
          return Err(LexerError::ParsingError);
        }
        // close tag, done collection attrs
        b'>' => {
          lexer.move_next();
          break;
        }
        b'\r' => {
          lexer.move_next();
          if lexer.get() == b'\n' {
            attrs.push(Attribute::NewLine);
            lexer.move_next();
          }
        }
        b'\n' => {
          attrs.push(Attribute::NewLine);
          lexer.move_next();
        }
        // any other char is a start of a attr name
        _ => {
          let attr_context = lexer.start_context();
          let name_context = lexer
            .start_context()
            .read_text(lexer, attr_name_ends)
            .expect("Could not read attr name");
          match lexer.get() {
            // full attr found
            b'=' => {
              lexer.move_next();
              attrs.push(Attribute::FullAttr(FullAttr::parse(
                lexer,
                attr_context,
                name_context,
                parent,
              )));
            }
            // if quote without eq its an error
            b'"' | b'\'' => {
              return Err(LexerError::ParsingError);
            }
            // any other ends
            _ => {
              // but only if its a valid attr_name_ends
              if attr_name_ends(lexer.get()) {
                attrs.push(Attribute::NameOnly(name_context));
              } else {
                return Err(LexerError::ParsingError);
              }
            }
          }
        }
      }
    }
    Ok(attrs)
  }
}

fn attr_name_ends(v: u8) -> bool {
  v == b' ' || v == b'=' || v == b'\'' || v == b'"' || v == b'\n' || v == b'>'
}
