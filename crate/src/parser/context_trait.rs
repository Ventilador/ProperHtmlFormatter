use crate::parser::lexer::Lexer;

pub trait WithContext {
    fn end_context(&mut self, lexer: &Lexer);
}
