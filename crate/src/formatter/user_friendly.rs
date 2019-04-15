use crate::parser::AST;


pub fn user_friendly(_ast: AST) -> AST {
  vec![noop].iter().fold(_ast, |ast, func| func(ast))
}

fn noop(_ast: AST) -> AST {
  unimplemented!();
}
