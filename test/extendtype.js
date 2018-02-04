import test from "ava";
import { parse } from "..";

test("extend type definition", t => {
  const [actual] = parse(`
    // A humanoid creature in the Star Wars universe
    extend type Human {
      sex: String
    }
  `);

  const expected = {
    type: "EXTEND_TYPE",
    name: "Human",
    description: "A humanoid creature in the Star Wars universe",
    fields: {
      sex: { type: "String" },
    }
  };

  return t.deepEqual(actual, expected);
});

