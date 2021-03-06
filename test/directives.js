import test from "ava"
import { parse } from ".."

test("directive type", t => {
  const [actual] = parse(`
  directive @auth(roles: [String]) on FIELD_DEFINITION |FIELD
  `)

  const expected = {
    type: "DIRECTIVE",
    directive: {
      name: "auth",
      args: "roles: [String]"
    },
    on: ["schema", "query"]
  }

  return t.deepEqual(actual, expected)
})

test("directive on scalar", t => {
  const [actual] = parse(`
  // a test AlphaNumeric scalar
  scalar AlphaNumeric @stringValue(regex: "^[0-9a-zA-Z]*$")  
  `)

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    description: "a test AlphaNumeric scalar",
    directives: [
      {
        name: "stringValue",
        args: 'regex: "^[0-9a-zA-Z]*$"'
      }
    ]
  }

  return t.deepEqual(actual, expected)
})

test("directive on include $variable", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @include(if: $show)
  `)

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        name: "include",
        args: "if: $show"
      }
    ]
  }

  return t.deepEqual(actual, expected)
})

test("directive with @_", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @_(countBy: "gender")
  `)

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        name: "_",
        args: 'countBy: "gender"'
      }
    ]
  }

  return t.deepEqual(actual, expected)
})

test("directive with []", t => {
  const [actual] = parse(`
    // a test AlphaNumeric scalar
    scalar AlphaNumeric @numberValue( oneOf: [ 1, 2, 4, 8, 16, 32, 64, 128 ]  )
  `)

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    description: "a test AlphaNumeric scalar",
    directives: [
      {
        name: "numberValue",
        args: "oneOf: [ 1, 2, 4, 8, 16, 32, 64, 128 ]  "
      }
    ]
  }

  return t.deepEqual(actual, expected)
})

test("multiple directives", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @stringValue(oneOf: [" ","X", "O"]) @auth(roles: ["admin"])
  `)

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        name: "stringValue",
        args: 'oneOf: [" ","X", "O"]'
      },
      {
        name: "auth",
        args: 'roles: ["admin"]'
      }
    ]
  }

  return t.deepEqual(actual, expected)
})

test("multiple directives 2", t => {
  const [actual] = parse(`
    scalar AlphaNumeric @upper
  `)

  const expected = {
    type: "SCALAR",
    name: "AlphaNumeric",
    directives: [
      {
        name: "upper"
      }
    ]
  }

  return t.deepEqual(actual, expected)
})

test("directive on parametrized field", t => {
  const [actual] = parse(`
  type Query {
    customerAccount(accountId: String): CustomerAccount @auth
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
            name: "auth"
          }
        ]
      }
    }
  }

  return t.deepEqual(actual, expected)
})

test("directive on type", t => {
  const [actual] = parse(`
  type Customer @rootEntity {
    customerAccount(accountId: String): CustomerAccount @auth
    }
  `)

  const expected = {
    type: "TYPE",
    name: "Customer",
    directives: [
      {
        name: "rootEntity"
      }
    ],
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
            name: "auth"
          }
        ]
      }
    }
  }

  return t.deepEqual(actual, expected)
})
