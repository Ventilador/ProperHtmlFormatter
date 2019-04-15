use crate::parser::attr::Attribute;
use crate::parser::attr::FullAttr;
use crate::parser::lexer::Lexer;
use crate::printer::printable::Printable;

impl Printable for Attribute {
  fn print(&self, lexer: &Lexer, writer: &mut Vec<u8>) -> usize {
    match self {
      Attribute::FullAttr(attr) => attr.print(lexer, writer),
      Attribute::NameOnly(context) => context.print(lexer, writer),
      Attribute::NewLine => {
        writer.push(b'\r');
        writer.push(b'\n');
        2
      }
    }
  }

  fn len(&self, lexer: &Lexer) -> usize {
    match self {
      Attribute::FullAttr(full_attr) => full_attr.len(lexer),
      Attribute::NameOnly(context) => context.len(lexer),
      Attribute::NewLine => 2,
    }
  }
}

impl Printable for FullAttr {
  fn print(&self, lexer: &Lexer, writer: &mut Vec<u8>) -> usize {
    let mut written = 1;
    written += self.name.print(lexer, writer);
    writer.push(b'=');
    written += self.value.print(lexer, writer);
    written
  }

  fn len(&self, lexer: &Lexer) -> usize {
    // name plus value + 1 for the eq sign
    self.name.len(lexer) + self.value.len(lexer) + 1
  }
}
