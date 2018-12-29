import test from "ava";
import { parse } from "..";

test("special chars in comment description", t => {
  const [actual] = parse(`
    # FOO, is a special (_)!.
    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO, is a special (_)!.",
    values: [{ name: "FOO" }]
  };

  return t.deepEqual(actual, expected);
});

test("add '#' comments as description", t => {
  const [actual] = parse(`
    # FOO as in Foobar
    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO as in Foobar",
    values: [{ name: "FOO" }]
  };

  return t.deepEqual(actual, expected);
});

test("add '#' comments as description AND EXTRA LINE", t => {
  const [actual] = parse(`
    # FOO as in Foobar

    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO as in Foobar",
    values: [{ name: "FOO" }]
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
    values: [{ name: "FOO" }]
  };

  return t.deepEqual(actual, expected);
});

test("add '//' comments as description AND EXTRA LINE", t => {
  const [actual] = parse(`
    // FOO as in Foobar

    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO as in Foobar",
    values: [{ name: "FOO" }]
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
    values: [{ name: "FOO" }]
  };

  return t.deepEqual(actual, expected);
});

test("add '/**/' comments as description AND EXTRA LINES", t => {
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
    values: [{ name: "FOO" }]
  };

  return t.deepEqual(actual, expected);
});


test("add \"\"\" comments as description", t => {
  const [actual] = parse(`
    """
      FOO as in Foobar
    """
    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO as in Foobar",
    values: [{ name: "FOO" }]
  };

  return t.deepEqual(actual, expected);
});


test("add \"\"\" comments as description AND EXTRA LINES", t => {
  const [actual] = parse(`
    """
      FOO as in Foobar
    """


    enum Bar { FOO }
  `);

  const expected = {
    type: "ENUM",
    name: "Bar",
    description: "FOO as in Foobar",
    values: [{ name: "FOO" }]
  };

  return t.deepEqual(actual, expected);
});


test("add comments as field description", t => {
  const [actual] = parse(`
    // A humanoid creature in the Star Wars universe
    type Human implements Character {
      # the id
      id: String!
      // the name
      name: String
      """
      this is a comment
      """
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
        description: "this is a comment",
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
      },
      homePlanet: {
        type: "String",
        description: "the home planet"
      }
    },
    implements: ["Character"]
  };

  return t.deepEqual(actual, expected);
});
