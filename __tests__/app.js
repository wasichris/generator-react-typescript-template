"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-react-typescript-template:app", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts({
      projectName: "",
      projectDesc: ""
    });
  }, 20000);

  it("creates files", () => {
    assert.file([".vscode/settings.json", ".gitignore"]);
  });
});
