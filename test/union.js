import test from "ava";
import { parse } from "..";

test("union one definition", t => {
  const [actual] = parse(`
    // a test union
    union MultipleUnion = Foo
  `);

  const expected = {
    type: "UNION",
    name: "MultipleUnion",
    description: "a test union",
    values: ["Foo"]
  };

  return t.deepEqual(actual, expected);
});

test("union multiple definition", t => {
  const [actual] = parse(`
    // a test union
    union MultipleUnion = Foo | Bar | Lap
  `);

  const expected = {
    type: "UNION",
    name: "MultipleUnion",
    description: "a test union",
    values: ["Foo", "Bar", "Lap"]
  };

  return t.deepEqual(actual, expected);
});
