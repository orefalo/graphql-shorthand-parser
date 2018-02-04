import test from "ava";
import { parse } from "..";

test(" on scalar", t => {
  const [actual] = parse(`
    // a test AlphaNumeric scalar
    scalar AlphaNumeric @stringValue(
      regex: "^[0-9a-zA-Z]*$"
    )
  `);

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    description: "a test AlphaNumeric scalar",
    directives: [
      {
        type: "DIRECTIVE",
        name: "stringValue",
        value: 'regex: "^[0-9a-zA-Z]*$"'
      }
    ]
  };

  return t.deepEqual(actual, expected);
});
