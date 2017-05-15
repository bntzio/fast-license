#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const emoji = require('node-emoji');
const figlet = require('figlet');

// chalk theme
const normal = chalk.blue;
const success = chalk.bold.green;
const warning = chalk.bold.yellow;
const error = chalk.bold.red;

// emojis
const smile = emoji.get('smile');
const smiley = emoji.get('smiley');
const wave = emoji.get('wave');

// ascii
const ascii = function(name) {
  figlet(name, function(err, data) {
    if (err) {
      console.log(error('Something went wrong...'));
      console.dir(err);
      return;
    }
    console.log(data);
  });
};

// inquirer questions
const mainQuestions = [
  {
    type: 'input',
    name: 'first_name',
    message: 'What\'s your first name?'
  },
  {
    type: 'input',
    name: 'last_name',
    message: 'What\'s your last name?'
  }
];
const readyQuestions = [
  {
    type: 'confirm',
    name: 'is_ready',
    message: 'Are you ready?'
  }
];

// inquirer prompts
const mainPrompt = function() {
  return inquirer.prompt(mainQuestions).then(function(answers) {
    console.log(chalk.blue(`Hello, ${answers.first_name} ${answers.last_name}!`));
  });
};
const readyPrompt = function() {
  return inquirer.prompt(readyQuestions).then(function(answers) {
    if (answers.is_ready) {
      clear();
      mainPrompt();
    } else {
      console.log(normal(`Ok! See you later! ${wave}`));
      process.exit(0);
    }
  });
};

// start the cli-app
const startApp = function() {
  clear();
  ascii('Fast License');
  setTimeout(function() {
    console.log(normal(`Hello there! ${smile}`));
    console.log(normal(`To create your ${chalk.bold('fast-license')} I'm going to ask you some basic questions...`));
    readyPrompt();
  }, 1000);
};


// start app!
startApp();
