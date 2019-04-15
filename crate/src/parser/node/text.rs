use crate::parser::context::Context;
use crate::parser::lexer::Lexer;

#[derive(Debug)]
pub struct TextLine {
  pub context: Context,
}

impl TextLine {
  pub fn new(lexer: &mut Lexer, context: Context) -> Self {
    TextLine {
      context: lexer.end_context(context),
    }
  }
}
