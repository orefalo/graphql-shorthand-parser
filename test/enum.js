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

  const expected = {
    type: "ENUM",
    name: "Episode",
    description: "One of the films in the Star Wars Trilogy",
    values: ["NEWHOPE", "EMPIRE", "JEDI"]
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
    values: ["NEWHOPE", "EMPIRE", "JEDI"]
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
    values: ["NEWHOPE"]
  };

  return t.deepEqual(actual, expected);
});
