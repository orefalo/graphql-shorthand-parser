import test from "ava";
import { parse } from "..";

test("enum definition", t => {
  const [actual] = parse(`
    // One of the films in the Star Wars Trilogy
    enum Episode {
      NEWHOPE
      EMPIRE
      JEDI
    }
  `);

  const expected =  {
    "type": "ENUM",
    "name": "Episode",
    "description": "One of the films in the Star Wars Trilogy",
    "values": [
       {
          "name": "NEWHOPE"
       },
       {
          "name": "EMPIRE"
       },
       {
          "name": "JEDI"
       }
    ]
 };

  return t.deepEqual(actual, expected);
});

test("enum definition one line", t => {
  const [actual] = parse(`
    // One of the films in the Star Wars Trilogy
    enum Episode { NEWHOPE EMPIRE JEDI }
  `);

  const expected = {
    type: "ENUM",
    name: "Episode",
    description: "One of the films in the Star Wars Trilogy",
    values: [
      {
        name: "NEWHOPE"
      },
      {
        name: "EMPIRE"
      },
      {
        name: "JEDI"
      }
    ]
  };

  return t.deepEqual(actual, expected);
});

test("enum definition 1", t => {
  const [actual] = parse(`
    // One of the films in the Star Wars Trilogy
    enum Episode {
      NEWHOPE
    }
  `);

  const expected = {
    type: "ENUM",
    name: "Episode",
    description: "One of the films in the Star Wars Trilogy",
    values: [
      {
        name: "NEWHOPE"
      }
    ]
  };

  return t.deepEqual(actual, expected);
});

test("enum bug 1", t => {
  const [actual] = parse(`
  # One of the films in the Star Wars Trilogy
  enum Episode {
    # Released in 1977.
    NEWHOPE
  
    # Released in 1980.
    EMPIRE
  
    # Released in 1983.
    JEDI
  }
  `);

  const expected = {
    type: "ENUM",
    name: "Episode",
    description: "One of the films in the Star Wars Trilogy",
    values: [
      {
        description: "Released in 1977.",
        name: "NEWHOPE"
      },
      {
        description: "Released in 1980.",
        name: "EMPIRE"
      },
      {
        description: "Released in 1983.",
        name: "JEDI"
      }
    ]
  };

  return t.deepEqual(actual, expected);
});
