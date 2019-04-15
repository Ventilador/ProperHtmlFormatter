use crate::parser::AST;

#[derive(Default)]
pub struct Options {
  max_line_length: usize,
  max_attr_count: usize,
  keep_nl: bool,
}

impl Options {
  pub fn transform<'a>(&self, _ast: AST<'a>) -> AST<'a> {
    unimplemented!();
  }
}
