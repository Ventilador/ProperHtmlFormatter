use super::errors::LexerError;
use super::lexer::Lexer;

#[derive(Debug)]
pub struct Context {
  pub start: usize,
  pub end: usize,
  pub line_start: usize,
  pub line_end: usize,
  pub position_start: usize,
  pub position_end: usize,
}

impl Context {
  pub fn multiline(&self) -> bool {
    self.line_start != self.line_end
  }

  pub fn read_text<F>(self, lexer: &mut Lexer, filter: F) -> Result<Context, LexerError>
  where
    F: Fn(u8) -> bool,
  {
    lexer.peek_until(filter);
    if !lexer.walked(&self) {
      return Err(LexerError::ParsingError);
    }
    Ok(lexer.end_context(self))
  }
}
