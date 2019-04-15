use crate::parser::attr::Attribute;
use crate::parser::AST;

pub struct Utils;
impl Utils {
    pub fn remove_repeated_new_lines(ast: AST) -> AST {
        return AST {
            elms: nodes::remove_repeated_new_lines(ast.elms),
            lexer: ast.lexer,
        };
    }
}

mod nodes {
    use crate::parser::node::node_element::NodeElement;
    use crate::parser::node::Element;

    pub fn remove_repeated_new_lines(vec: Vec<Element>) -> Vec<Element> {
        let mut last_val_is_nl = false;
        vec.into_iter()
            .filter(|_elm| {
                if let Element::NewLine(_) = _elm {
                    if last_val_is_nl {
                        false
                    } else {
                        last_val_is_nl = true;
                        true
                    }
                } else {
                    last_val_is_nl = false;
                    true
                }
            })
            .map(|elm| match elm {
                Element::Node(node) => Element::Node(NodeElement {
                    parent: node.parent,
                    attrs: super::attrs::remove_repeated_new_lines(node.attrs),
                    childs: remove_repeated_new_lines(node.childs),
                    context: node.context,
                    name: node.name,
                }),
                node => node,
            })
            .collect()
    }

}

mod attrs {
    use crate::parser::attr::Attribute;

    pub fn remove_repeated_new_lines(vec: Vec<Attribute>) -> Vec<Attribute> {
        let mut last_val_is_nl = false;
        vec.into_iter()
            .filter(|elm| {
                if let Attribute::NewLine = elm {
                    if last_val_is_nl {
                        false
                    } else {
                        last_val_is_nl = true;
                        true
                    }
                } else {
                    last_val_is_nl = false;
                    true
                }
            })
            .collect()
    }
}
