use crate::parser::context::{Context, Reader};
use std::cell::RefCell;
use std::rc::Rc;

pub enum TokenType {
    TagName(Context),
    TagOpen(Context),
    TagClose(Context),
    Text(Context),
    NewLine(Context),
    AttrName(Context),
    AttrValue(Context),
}

pub type TokenRef = Option<Rc<RefCell<Token>>>;

pub struct Token {
    pub parent: TokenRef,
    pub prev: TokenRef,
    pub next: TokenRef,
    pub item: TokenType,
}
