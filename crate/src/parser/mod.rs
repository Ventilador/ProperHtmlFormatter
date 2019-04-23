use crate::parser::token::Token;

mod context;
mod token;

struct Parser;

impl Parser {
    fn parse(_val: &str) -> Vec<Token> {
        unimplemented!();
    }
}

#[test]
fn parses_successfully() {
    Parser::parse("<div></div>");
}
