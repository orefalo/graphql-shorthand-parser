import test from "ava"
import { parse } from ".."

test("deprecated on scalar", t => {
  const [actual] = parse(`
  // a test AlphaNumeric deprecation
  scalar AlphaNumeric @deprecated(reason: "killed off AlphaNumeric")  
  `)

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    description: "a test AlphaNumeric deprecation",
    directives: [
      {
        name: "deprecated",
        args: 'reason: "killed off AlphaNumeric"'
      }
    ]
  }

  return t.deepEqual(actual, expected)
})

test("deprecated on field", t => {
  const [actual] = parse(`
  type Query {
    customerAccount(accountId: String): CustomerAccount @deprecated(reason: "killed off customerAccount")
    }
  `)

  const expected = {
    type: "TYPE",
    name: "Query",
    fields: {
      customerAccount: {
        type: "CustomerAccount",
        args: {
          accountId: {
            type: "String"
          }
        },
        directives: [
          {
            name: "deprecated",
            args: 'reason: "killed off customerAccount"'
          }
        ]
      }
    }
  }

  return t.deepEqual(actual, expected)
})

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
