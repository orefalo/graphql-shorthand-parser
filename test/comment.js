import test from "ava";
import { parse } from "..";

test("add '#' comments as description", t => {
  const [actual] = parse(`
    # FOO as in Foobar
    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO as in Foobar",
    values: ["FOO"]
  };

  return t.deepEqual(actual, expected);
});

test("add '//' comments as description", t => {
  const [actual] = parse(`
    // FOO as in Foobar
    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO as in Foobar",
    values: ["FOO"]
  };

  return t.deepEqual(actual, expected);
});

test("add '/**/' comments as description", t => {
  const [actual] = parse(`
    /*
      FOO as in Foobar
    */
    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO as in Foobar",
    values: ["FOO"]
  };

  return t.deepEqual(actual, expected);
});

test("add comments as field description", t => {
  const [actual] = parse(`
    // A humanoid creature in the Star Wars universe
    type Human : Character {
      # the id
      id: String!
      // the name
      name: String
      friends: [Character]
      appearsIn: [Episode]
      /* the home planet */
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
        required: true,
        description: "the id"
      },
      name: {
        type: "String",
        description: "the name"
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
        type: "String",
        description: "the home planet"
      }
    },
    interfaces: ["Character"]
  };

  return t.deepEqual(actual, expected);
});
