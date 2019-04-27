use crate::parser::context::Context;
use crate::parser::context_manager::ContextManager;
use crate::parser::tokens::Reader;

pub struct TagEnd {
  context: Context,
}

impl Reader for TagEnd {
  fn read(self, context: &mut ContextManager) -> Self {
    unimplemented!();
  }
}
