import test from "ava";
import { parse } from "..";

test("directive on scalar", t => {
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

test("directive on include $variable", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @include(if: $show)
  `);

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        type: "DIRECTIVE",
        name: "include",
        value: "if: $show"
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
        type: "DIRECTIVE",
        name: "_",
        value: 'countBy: "gender"'
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
        type: "DIRECTIVE",
        name: "numberValue",
        value: "roneOf: [ 1, 2, 4, 8, 16, 32, 64, 128 ]"
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
        type: "DIRECTIVE",
        name: "stringValue",
        value: 'oneOf: [" ","X", "O"]'
      },
      {
        type: "DIRECTIVE",
        name: "auth",
        value: 'roles: ["admin"]'
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
        type: "DIRECTIVE",
        name: "upper",
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

