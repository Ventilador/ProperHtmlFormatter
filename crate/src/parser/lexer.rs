use super::context::Context;
use super::errors::LexerError;
use std::string::FromUtf8Error;
pub struct Lexer<'a> {
  times: usize,
  index: usize,
  buffer: &'a [u8],
  len: usize,
  line: usize,
  position: usize,
}

impl<'a> Lexer<'a> {
  pub fn new(buffer: &'a [u8]) -> Self {
    Lexer::<'a> {
      times: 1,
      index: 0,
      len: buffer.len(),
      buffer: buffer,
      line: 1,
      position: 1,
    }
  }

  pub fn get(&self) -> u8 {
    if self.index < self.len {
      return self.buffer[self.index];
    }

    unreachable!("Reading outside buffer");
  }

  pub fn get_index(&self, idx: usize) -> u8 {
    if idx < self.len {
      return self.buffer[idx];
    }
    b'\0'
  }

  pub fn peek(&self) -> u8 {
    if self.index + 1 < self.len {
      return self.buffer[self.index + 1];
    }
    b'\0'
  }

  pub fn next_is(&self, _char: u8) -> bool {
    self.peek() == _char
  }

  pub fn next_is_nonword(&self) -> bool {
    let peek = self.peek();
    peek == b' ' || peek == b'\r' || peek == b'\n' || peek == b'\t'
  }

  pub fn is(&self, _char: char) -> bool {
    self.buffer[self.index] == _char as u8
  }

  pub fn skip(&mut self, c: u8) {
    while self.more() && self.get() == c {
      self.move_next();
    }
  }

  pub fn back(&mut self) {
    if self.index > 0 {
      self.index -= 1;
    }
  }

  pub fn peek_until<F>(&mut self, filter: F)
  where
    F: Fn(u8) -> bool,
  {
    print!("Char peek {}", self.peek());
    print!("Filter result {}", filter(self.peek()));
    while self.more() && filter(self.peek()) == false {
      self.move_next();
    }
  }

  pub fn match_context(&mut self, to_check: &Context) -> Result<(), LexerError> {
    for i in to_check.start..to_check.end {
      if !self.more() | (self.get_index(i) != self.get()) {
        return Err(LexerError::ParsingError);
      }
      self.move_next();
    }

    Ok(())
  }

  pub fn skip_until<F>(&mut self, filter: F)
  where
    F: Fn(u8) -> bool,
  {
    let mut escaping = false;
    while self.more() {
      let val = self.get();
      if escaping {
        escaping = false;
      } else if val == b'\\' {
        escaping = true;
      } else if !filter(val) {
        return;
      }
      self.move_next();
    }
  }

  pub fn more(&mut self) -> bool {
    self.times += 1;
    if self.times > self.len * 6 {
      panic!("stuck at {}", self.index);
    }
    self.index < self.len
  }

  pub fn move_next(&mut self) {
    self.index += 1;
    if self.more() {
      if self.get() == b'\n' {
        self.new_line();
      } else {
        self.position += 1;
      }
    }
  }

  pub fn to_string(&self, context: &Context) -> Vec<u8> {
    self.buffer[context.start..context.end].to_vec()
  }

  pub fn to_slice(&self, context: &Context) -> &[u8] {
    &self.buffer[context.start..context.end]
  }

  fn new_line(&mut self) {
    self.line += 1;
    self.position = 1;
  }

  pub fn walked(&self, context: &Context) -> bool {
    self.index != context.start
  }
}

impl<'a> Lexer<'a> {
  pub fn start_context(&self) -> Context {
    Context {
      start: self.index,
      end: 0,
      line_start: self.line,
      line_end: 0,
      position_start: self.position,
      position_end: 0,
    }
  }

  pub fn end_context_stay(&mut self, mut context: Context) -> Context {
    context.end = self.index;
    context.position_end = self.position;
    context.line_end = self.line;
    context
  }

  pub fn end_context(&mut self, mut context: Context) -> Context {
    context = self.end_context_stay(context);
    self.move_next();
    context
  }
}
