pub mod from_options;
pub mod user_friendly;

use crate::formatter::from_options::Options;
use crate::parser::AST;
use core::marker::PhantomData;
use user_friendly::user_friendly;

pub(crate) struct Formater {
  mode: FormatOptions,
}

impl Formater {
  pub fn friendly() -> Self {
    Formater {
      mode: FormatOptions::UserFriendly,
    }
  }

  pub fn new() -> Self {
    Formater {
      mode: FormatOptions::FromStats(Default::default()),
    }
  }

  pub fn parse<'a>(self, ast: AST<'a>) -> AST<'a> {
    match &self.mode {
      FormatOptions::UserFriendly => user_friendly(ast),
      FormatOptions::FromStats(options) => options.transform(ast),
    }
  }
}

enum FormatOptions {
  UserFriendly,
  FromStats(Options),
}
