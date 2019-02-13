import test from "ava"
import { parse } from ".."

test("interface definition", t => {
  const [actual] = parse(`
    // A character in the Star Wars Trilogy
    interface Character {
      id: String!
      name: String
      friends: [Character]
      appearsIn: [Episode]
    }
  `)

  const expected = {
    type: "INTERFACE",
    name: "Character",
    description: "A character in the Star Wars Trilogy",
    fields: {
      id: {
        type: "String",
        required: true
      },
      name: {
        type: "String"
      },
      friends: {
        type: {
          type: "Character"
        },
        array: true
      },
      appearsIn: {
        type: {
          type: "Episode"
        },
        array: true
      }
    }
  }

  return t.deepEqual(actual, expected)
})

test("interface definition implements", t => {
  const [actual] = parse(`
    // A character in the Star Wars Trilogy
    interface Lazlo implements Character {
      id: String!
    }
  `)

  const expected = {
    type: "INTERFACE",
    name: "Lazlo",
    description: "A character in the Star Wars Trilogy",
    fields: {
      id: { type: "String", required: true }
    },
    implements: ["Character"]
  }

  return t.deepEqual(actual, expected)
})
