use crate::parser::attr::Attribute;
use crate::parser::context::Context;
use crate::parser::errors::LexerError;
use crate::parser::lexer::Lexer;
use crate::parser::node::Element;
use std::cell::RefCell;
use std::rc::Rc;

pub type Parent = Rc<RefCell<Option<NodeElement>>>;

#[derive(Debug)]
pub struct NodeElement {
  pub parent: Parent,
  pub context: Context,
  pub name: Context,
  pub attrs: Vec<Attribute>,
  pub childs: Vec<Element>,
}

impl NodeElement {
  pub fn empty(lexer: &mut Lexer, parent: &Rc<RefCell<Option<NodeElement>>>) -> Self {
    NodeElement {
      context: lexer.start_context(),
      parent: parent.clone(),
      name: lexer
        .start_context()
        .read_text(lexer, is_node_name_end)
        .expect("Could not read node name"),
      attrs: vec![],
      childs: vec![],
    }
  }

  pub fn parse(lexer: &mut Lexer, parent: &Parent) -> Result<Self, LexerError> {
    let mut nodeToReturn = NodeElement::empty(lexer, parent);

    let attrs =
      Attribute::parse(lexer, Rc::from(RefCell::from(panic!()))).expect("Could not parse attrs");
    let childs = Element::parse(lexer).expect("Could not parse child nodes");
    lexer.match_context(&name).expect("Closing tag mismatch");
    lexer.move_next();
    lexer.skip_until(is_not_whitespace);
    if lexer.get() != b'>' {
      return Err(LexerError::ParsingError);
    }

    Ok(NodeElement {
      parent: Rc::new(RefCell::from(None)),
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
