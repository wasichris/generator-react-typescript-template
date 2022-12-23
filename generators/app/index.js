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

    // Deal with the file/folder name begin with '.'
    // They will not copy by default
    // this.fs.copy(
    //   this.templatePath(".gitignore"),
    //   this.destinationPath(".gitignore")
    // );
    // this.fs.copy(this.templatePath(".vscode"), this.destinationPath(".vscode"));
  }

  install() {
    this.log("Install project packages by npm.");
    this.spawnCommandSync("npm", ["install"]);
  }
};
