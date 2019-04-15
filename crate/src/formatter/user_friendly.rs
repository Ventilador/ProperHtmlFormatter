use crate::formatter::utils::Utils;
use crate::parser::AST;

pub fn user_friendly(ast: AST) -> AST {
  Utils::remove_repeated_new_lines(ast)
}

fn noop(_ast: AST) -> AST {
  unimplemented!();
}
