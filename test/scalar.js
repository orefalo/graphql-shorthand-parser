import test from "ava";
import { parse } from "..";

test("directives definition", t => {
  const [actual] = parse(`
    // a test uuid scalar
    scalar UUID
  `);

  const expected = {
    type: "SCALAR",
    name: "UUID",
    description: "a test uuid scalar"
  };

  return t.deepEqual(actual, expected);
});
