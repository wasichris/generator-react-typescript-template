/* eslint-disable capitalized-comments */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the dazzling ${chalk.red(
          "generator-react-typescript-template"
        )} generator!`
      )
    );

    // Collect the info that we need.
    this.answers = await this.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Please input project name:",
        default: "react-project"
      },
      {
        type: "input",
        name: "projectDesc",
        message: "Please input project description:",
        default: "react 18 project with typescript"
      }
    ]);
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.answers.projectName) {
      this.log(`\nYour generator must be inside a folder named
        ${this.answers.projectName}\n
        I will automatically create this folder.\n`);

      mkdirp.sync(this.answers.projectName);
      this.destinationRoot(this.destinationPath(this.answers.projectName));
    }
  }

  writing() {
    // Copy all files
    this.fs.copy(this.templatePath("**"), this.destinationRoot());

    // Update README.md content
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      { projectName: this.answers.projectName }
    );

    // Update package.json content
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), {
      name: this.answers.projectName,
      description: this.answers.projectDesc
    });

    // The file/folder name begin with '.' will not copy by default
    // workaround: copy it directly
    this.fs.copy(this.templatePath(".vscode"), this.destinationPath(".vscode"));

    // The .gitignore file will be missing after npm publish (might filter by npm)
    // workaround: use _gitignore to avoid this situation
    this.fs.delete(this.destinationPath("_gitignore"));
    this.fs.copy(
      this.templatePath("_gitignore"),
      this.destinationPath(".gitignore")
    );
  }

  install() {
    this.log("Install project packages by npm.");
    this.spawnCommandSync("npm", ["install"]);
  }

  end() {
    this.log("Git init.");
    this.spawnCommandSync("git", ["init", "-b", "main"]);

    this.log("Git commit.");
    this.spawnCommandSync("git", ["add", "--all"]);
    this.spawnCommandSync("git", [
      "commit",
      "-m",
      '"Initial commit from generator"'
    ]);

    this.log("Application start up command:");
    this.log(`cd ${this.answers.projectName}`);
    this.log("npm start");
  }
};
