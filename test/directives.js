import test from "ava";
import { parse } from "..";

test("directive on scalar", t => {
  const [actual] = parse(`
  // a test AlphaNumeric scalar
  scalar AlphaNumeric @stringValue(regex: "^[0-9a-zA-Z]*$")  
  `);

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    description: "a test AlphaNumeric scalar",
    directives: [
      {
        name: "stringValue",
        content: 'regex: "^[0-9a-zA-Z]*$"'
      }
    ]
  };

  return t.deepEqual(actual, expected);
});

test("directive on include $variable", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @include(if: $show)
  `);

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        name: "include",
        content: "if: $show"
      }
    ]
  };

  return t.deepEqual(actual, expected);
});

test("directive with @_", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @_(countBy: "gender")
  `);

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        name: "_",
        content: 'countBy: "gender"'
      }
    ]
  };

  return t.deepEqual(actual, expected);
});

test("directive with []", t => {
  const [actual] = parse(`
    // a test AlphaNumeric scalar
    scalar AlphaNumeric @numberValue( oneOf: [ 1, 2, 4, 8, 16, 32, 64, 128 ]  )
  `);

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    description: "a test AlphaNumeric scalar",
    directives: [
      {
        name: "numberValue",
        content: "oneOf: [ 1, 2, 4, 8, 16, 32, 64, 128 ]  "
      }
    ]
  };

  return t.deepEqual(actual, expected);
});

test("multiple directives", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @stringValue(oneOf: [" ","X", "O"]) @auth(roles: ["admin"])
  `);

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        name: "stringValue",
        content: 'oneOf: [" ","X", "O"]'
      },
      {
        name: "auth",
        content: 'roles: ["admin"]'
      }
    ]
  };

  return t.deepEqual(actual, expected);
});

test("multiple directives", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @upper
  `);

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        name: "upper"
      }
    ]
  };

  return t.deepEqual(actual, expected);
});

// type ticTacToe {
//   board: [[String!]!] @list(
//     minItems: 3,
//     maxItems: 3
//     innerList: {
//       minItems: 3,
//       maxItems: 3
//     }
//   ) @stringValue(oneOf: [" ","X", "O"])
// }
