import test from "ava";
import { parse } from "..";

test("type definition", t => {
  const [actual] = parse(`
    // A humanoid creature in the Star Wars universe
    type Human implements Character {
      id: String!
      name: String
      friends: [Character]
      appearsIn: [Episode]
      homePlanet: String
    }
  `);

  const expected = {
    type: "TYPE",
    name: "Human",
    description: "A humanoid creature in the Star Wars universe",
    fields: {
      id: {
        type: "String",
        required: true
      },
      name: {
        type: "String"
      },
      friends: {
        type: "Character",
        array: true
      },
      appearsIn: {
        type: "Episode",
        array: true
      },
      homePlanet: {
        type: "String"
      }
    },
    implements: ["Character"]
  };

  return t.deepEqual(actual, expected);
});

test("type definition with parameters", t => {
  const [actual] = parse(`
    type Query {
      hero(episode: Episode): Character
      human(id: String!): Human
      droid(id: String!): Droid
    }
  `);

  const expected = {
    type: "TYPE",
    name: "Query",
    fields: {
      hero: {
        type: "Character",
        args: {
          episode: {
            type: "Episode"
          }
        }
      },
      human: {
        type: "Human",
        args: {
          id: {
            type: "String",
            required: true
          }
        }
      },
      droid: {
        type: "Droid",
        args: {
          id: {
            type: "String",
            required: true
          }
        }
      }
    }
  };

  return t.deepEqual(actual, expected);
});

test("type definition with multiple interfaces", t => {
  const [actual] = parse(`
    type Human implements Character, AnotherThing {
      id: String!
      name: String
      friends: [Character]
      appearsIn: [Episode]
      homePlanet: String
    }
  `);

  const expected = {
    type: "TYPE",
    name: "Human",
    fields: {
      id: {
        type: "String",
        required: true
      },
      name: {
        type: "String"
      },
      friends: {
        type: "Character",
        array: true
      },
      appearsIn: {
        type: "Episode",
        array: true
      },
      homePlanet: {
        type: "String"
      }
    },
    implements: ["Character", "AnotherThing"]
  };

  return t.deepEqual(actual, expected);
});

test("type definition with [!]!", t => {
  const [actual] = parse(`
    type Human  {
      friends: [Character!]!
    }
  `);

  const expected = {
    type: "TYPE",
    name: "Human",
    fields: {
      friends: {
        type: "Character",
        array: true,
        noemptyelement: true,
        required: true
      }
    }
  };

  return t.deepEqual(actual, expected);
});

test("type definition with [[!]!]", t => {
  const [actual] = parse(`
  type ticTacToe {
    board: [[String!]!]!
  }
  `);

  const expected = {
    type: "TYPE",
    name: "ticTacToe",
    fields: {
      board: {
        type: {
          array: true,
          type: "Character",
          required: true
        },
        array: true,
        noemptyelement: true
      }
    }
  };

  return t.deepEqual(actual, expected);
});




test("type definition with default value", t => {
  const [actual] = parse(`
  type Query {
    identification(
      type: String = "personal-identity-code"
    ): [Identification]!
  }
  `);

  const expected = {
    type: "TYPE",
    name: "Query",
    fields: {
      identification: {
        type: "Identification",
        array: true,
        required: true,
        args: {
          type: {
            type: "String",
            defaultValue: "personal-identity-code"
          }
        }
      }
    }
  };

  return t.deepEqual(actual, expected);
});
