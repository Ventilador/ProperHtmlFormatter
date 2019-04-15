pub mod from_options;
pub mod user_friendly;
mod utils;
use crate::formatter::from_options::Options;
use crate::parser::AST;
use core::marker::PhantomData;
use user_friendly::user_friendly;

pub(crate) struct Formatter {
  mode: FormatOptions,
}

impl Formatter {
  pub fn friendly() -> Self {
    Formatter {
      mode: FormatOptions::UserFriendly,
    }
  }

  pub fn new() -> Self {
    Formatter {
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
