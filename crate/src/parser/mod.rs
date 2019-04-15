pub mod attr;
pub mod context;
pub mod errors;
pub mod lexer;
pub mod node;
pub mod tests;
use crate::parser::node::Element;
use errors::LexerError;
use lexer::Lexer;
pub(crate) fn parse(content: &[u8]) -> Result<AST, LexerError> {
  let mut lexer = Lexer::new(content);
  match Element::parse(&mut lexer) {
    Ok(r) => {
      print!("Seems it worked");
      return Ok(AST { lexer, elms: r });
    }
    Err(e) => match e {
      LexerError::InvalidSpace(_) => {
        panic!("invalid space");
      }
      LexerError::NoLexicalContextStartedError => {
        unreachable!();
      }
      LexerError::ParsingError => {
        panic!("invalid parsing");
      }
    },
  }
}

pub struct AST<'a> {
  pub lexer: Lexer<'a>,
  pub elms: Vec<Element>,
}
