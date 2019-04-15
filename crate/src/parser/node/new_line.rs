use crate::parser::context::Context;
use crate::parser::lexer::Lexer;

#[derive(Debug)]
pub struct NewLine {
  context: Context,
}

impl NewLine {
  pub fn new(lexer: &mut Lexer) -> Self {
    NewLine::from(lexer, lexer.start_context())
  }

  pub fn from(lexer: &mut Lexer, context: Context) -> Self {
    NewLine {
      context: lexer.end_context(context),
    }
  }
}
