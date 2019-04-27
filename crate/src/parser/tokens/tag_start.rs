use crate::parser::context::Context;
use crate::parser::context_manager::ContextManager;
use crate::parser::tokens::Reader;

pub struct TagStart {
  context: Context,
}

impl Reader for TagStart {
  fn read(self, context: &mut ContextManager) -> Self {
    unimplemented!();
  }
}
