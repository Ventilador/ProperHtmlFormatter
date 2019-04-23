pub const NEW_LINE: u8 = b'\n';
pub const RETURN: u8 = b'\r';
pub const EOF: u8 = b'\0';

pub struct Context {
    s_index: usize,
    e_index: usize,
    s_line: usize,
    e_line: usize,
    s_pos: usize,
    e_pos: usize,
}

pub struct Reader<'a> {
    buf: &'a [u8],
    index: usize,
    line: usize,
    pos: usize,
    len: usize,
}

impl<'a> Reader<'a> {
    pub fn from_slice(val: &'a str) -> Reader<'a> {
        Reader {
            buf: val.as_bytes(),
            index: 0,
            line: 1,
            pos: 1,
            len: val.len(),
        }
    }

    pub fn read<F: Fn(u8) -> bool>(&mut self, _from: Context, _f: F) -> Context {
        unimplemented!();
    }

    pub fn peek(&self) -> u8 {
        if self.index < self.len {
            self.buf[self.index]
        } else {
            EOF
        }
    }

    pub fn seek(&self, amount: usize) -> u8 {
        let amount = amount + self.index;
        if amount < self.len {
            self.buf[amount]
        } else {
            EOF
        }
    }
}
