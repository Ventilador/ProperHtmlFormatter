use super::context::Context;
use std::fmt::Debug;

#[derive(Debug)]
pub enum LexerError {
  NoLexicalContextStartedError,
  ParsingError,
  InvalidSpace(Context),
}
