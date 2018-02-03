import babel from "rollup-plugin-babel";
import pegjs from "rollup-plugin-pegjs";

export default {
  input: "src/graphql-shorthand.pegjs",
  output: {
    file: "dist/graphql-shorthand.js",
    format: "cjs"
  },
  plugins: [pegjs(), babel()]
};
