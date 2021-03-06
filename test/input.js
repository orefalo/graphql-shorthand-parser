import test from "ava"
import { parse } from ".."

test("input definition", t => {
  const [actual] = parse(`
    // A Person
    input Person {
      id: String!
      // The full name
      name: String
    }
  `)

  const expected = {
    type: "INPUT",
    name: "Person",
    description: "A Person",
    fields: {
      id: { type: "String", required: true },
      name: { type: "String", description: "The full name" }
    }
  }

  return t.deepEqual(actual, expected)
})

test("input with boolean defaultValue", t => {
  const [actual] = parse(`
    input Person {
      alive: Boolean = true
    }
  `)

  const expected = {
    type: "INPUT",
    name: "Person",
    fields: {
      alive: { type: "Boolean", defaultValue: true }
    }
  }

  return t.deepEqual(actual, expected)
})

test("input with string default values", t => {
  const [actual] = parse(`
    // A Person
    input Person {
      id: String!
      firstname: String = "Hans"
      lastname: String = "Wurst"
    }
  `)

  const expected = {
    type: "INPUT",
    name: "Person",
    description: "A Person",
    fields: {
      id: { type: "String", required: true },
      firstname: { type: "String", defaultValue: "Hans" },
      lastname: { type: "String", defaultValue: "Wurst" }
    }
  }

  return t.deepEqual(actual, expected)
})

test("input with integer defaultValue", t => {
  const [actual] = parse(`
    input Person {
      age: Int = 32
    }
  `)

  const expected = {
    type: "INPUT",
    name: "Person",
    fields: {
      age: { type: "Int", defaultValue: 32 }
    }
  }

  return t.deepEqual(actual, expected)
})

test("input with float defaultValue", t => {
  const [actual] = parse(`
    input Person {
      height: Float = 1.82
      iq: Float = .5
    }
  `)

  const expected = {
    type: "INPUT",
    name: "Person",
    fields: {
      height: { type: "Float", defaultValue: 1.82 },
      iq: { type: "Float", defaultValue: 0.5 }
    }
  }

  return t.deepEqual(actual, expected)
})
