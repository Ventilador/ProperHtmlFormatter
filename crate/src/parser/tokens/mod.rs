use crate::parser::context_manager::ContextManager;
use std::cell::RefCell;
use std::rc::Rc;

pub mod tag_start;
pub trait Reader {
  fn read(self, cManager: &mut ContextManager) -> Self;
}

pub enum Token {
  TagStart,
  TagEnd,
  Attribute,
  Equals,
  Value,
  TagClose,
  NewLine,
  Text,
}

pub struct StackNode<T: Clone> {
  next: Rc<RefCell<Option<StackNode<T>>>>,
  value: T,
}

pub struct Stack<T: Clone> {
  first: Rc<RefCell<Option<StackNode<T>>>>,
  len: usize,
}

impl<T: Clone> Stack<T> {
  pub fn new() -> Self {
    Stack {
      first: Rc::new(RefCell::new(None)),
      len: 0,
    }
  }

  pub fn len(&self) -> usize {
    self.len
  }

  pub fn more(&self) -> bool {
    self.len > 0
  }

  pub fn push(&mut self, val: T) -> &Self {
    let mut first: std::cell::RefMut<Option<StackNode<T>>> = self.first.borrow_mut();
    if let Some(current_node) = first.take() {
      first.replace(StackNode {
        next: Rc::new(RefCell::new(Some(current_node))),
        value: val,
      });
    } else {
      first.replace(StackNode {
        next: Rc::new(RefCell::new(None)),
        value: val,
      });
    }
    self.len += 1;
    self
  }

  pub fn pop(&mut self) -> T {
    let mut first: std::cell::RefMut<Option<StackNode<T>>> = self.first.borrow_mut();
    let token = if let Some(current_node) = first.take() {
      let val = current_node.next;
      *first = val.borrow_mut().take();
      current_node.value
    } else {
      panic!("No more items in the stack");
    };
    // self.first = value;
    self.len -= 1;
    token
  }

  pub fn peek(&self) -> Option<T> {
    match self.first.borrow().as_ref() {
      Some(node) => Some(node.value.clone()),
      None => None,
    }
  }
}

#[test]
fn stack() {
  let mut stack = Stack::new();
  stack.push(0);
  stack.push(1);
  stack.push(2);
  let mut counter = 2;
  while stack.more() {
    assert_eq!(stack.pop(), counter);
    counter -= 1;
  }
}

#[test]
fn stack_char() {
  let mut stack = Stack::new();
  stack.push(b'0');
  stack.push(b'1');
  stack.push(b'2');
  stack.push(b'3');
  let mut vec = [b'3', b'2', b'1', b'0'].iter();

  while stack.more() {
    assert_eq!(stack.pop(), *vec.next().expect("wow"));
  }
}
