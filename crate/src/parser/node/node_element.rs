use crate::parser::errors::LexerError;
use crate::parser::context::Context;
use crate::parser::lexer::Lexer;
use crate::parser::attr::Attribute;
use crate::parser::node::Element;

#[derive(Debug)]
pub struct NodeElement {
  pub context: Context,
  pub name: Context,
  pub attrs: Vec<Attribute>,
  pub childs: Vec<Element>,
}

impl NodeElement {
  pub fn parse(lexer: &mut Lexer) -> Result<Self, LexerError> {
    let context = lexer.start_context();
    let name = lexer
      .start_context()
      .read_text(lexer, is_node_name_end)
      .expect("Could not read node name");
    let attrs = Attribute::parse(lexer).expect("Could not parse attrs");
    let childs = Element::parse(lexer).expect("Could not parse child nodes");
    lexer.match_context(&name).expect("Closing tag mismatch");
    lexer.move_next();
    lexer.skip_until(is_not_whitespace);
    if lexer.get() != b'>' {
      return Err(LexerError::ParsingError);
    }

    Ok(NodeElement {
      name,
      attrs,
      childs,
      context: lexer.end_context(context),
    })
  }
}

fn is_not_whitespace(c: u8) -> bool {
  (c == b' ') | (c == b'\n')
}

fn is_node_name_end(c: u8) -> bool {
  c == b' ' || c == b'\n' || c == b'>'
}
