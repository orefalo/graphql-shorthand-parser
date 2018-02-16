import test from "ava";
import { parse } from "..";
import fs from "fs";

function load(file) {
  fs.readFile(file, "utf8", function(err, data) {
    if (err) throw err;
    return data;
  });
}

test("parse StarWars schema", t => {
  try {
    const schema = load("./starwars.graphql");
    console.log(schema);
    const [actual] = parse(schema);
    return t.pass("good");
  } catch (e) {
    console.log(e);
    return t.throws(e);
  }
});
