use crate::parser::context::Context;

pub struct ContextManager<'a> {
  buf: &'a [u8],
  index: usize,
  pos: usize,
  line: usize,
  size: usize,
}

impl<'a> ContextManager<'a> {
  pub fn new(content: &'a str) -> Self {
    ContextManager {
      buf: content.as_bytes(),
      index: 0,
      line: 0,
      pos: 0,
      size: content.len(),
    }
  }

  pub fn consume<F>(&mut self, context: &mut Context, f: F)
  where
    F: Fn(u8) -> bool,
  {
    unimplemented!();
  }

  pub fn cur(&self) -> u8 {
    if self.can_peek(0) {
      self.buf[self.index]
    } else {
      panic!("Reaching out of buffer");
    }
  }

  pub fn peek(&self, amount: usize) -> u8 {
    if amount == 0 {
      print!("Use self.cur()");
      self.cur()
    } else {
      if self.can_peek(amount) {
        self.buf[self.index]
      } else {
        b'\0'
      }
    }
  }

  pub fn can_peek(&self, amount: usize) -> bool {
    if amount == 0 {
      self.index < self.size
    } else {
      (self.index + amount) < self.size
    }
  }

  pub fn next(&mut self) {
    unimplemented!();
  }
}
