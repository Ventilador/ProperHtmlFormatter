// use super::parse;
// use std::fs::File;
// use std::io::Read;
// use std::path::{Component, Path, PathBuf};

// #[test]
// pub fn parse_sample_1() {
//   parse(&load_file(&get_path("sample1"))).expect("Could not parse");
// }

// // #[test]
// // pub fn parse_sample_2() {
// //   parse(&load_file(&get_path("sample2")));
// // }

// fn get_path(path: &str) -> String {
//   let mut dir = std::env::current_dir().expect("Could not read cur dir");
//   dir.push("src");
//   dir.push("htmls");
//   dir.push(path);
//   dir.set_extension("html");
//   String::from(
//     dir
//       .to_str()
//       .expect(&format!("Could not parse path for '{}'", path)),
//   )
// }

// fn load_file(path: &str) -> Vec<u8> {
//   let mut data = vec![];
//   File::open(path)
//     .expect(&format!("Could not open file '{}'", path))
//     .read_to_end(&mut data)
//     .expect(&format!("Somethign when wrong when reading '{}'", path));
//   data
// }
