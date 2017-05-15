#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const emoji = require('node-emoji');
const figlet = require('figlet');
const touch = require('touch');
const fs = require('fs');

// paths to licenses
const mitPath = require.resolve('./licenses/mit');
const apache2Path = require.resolve('./licenses/apache-2.0');
const bsd3Path = require.resolve('./licenses/bsd-3-clause');
const bsd2Path = require.resolve('./licenses/bsd-2-clause');
const gpl3Path = require.resolve('./licenses/gpl-3.0');
const lgpl3Path = require.resolve('./licenses/lgpl-3.0');
const mpl2Path = require.resolve('./licenses/mpl-2.0');

// chalk theme
const normal = chalk.blue;
const success = chalk.bold.green;
const warning = chalk.bold.yellow;
const error = chalk.bold.red;

// emojis
const smile = emoji.get('smile');
const wave = emoji.get('wave');
const tada = emoji.get('tada');

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
const choices = [
  {
    type: 'list',
    name: 'choice_list',
    message: 'Which license do you need?',
    choices: [
      'MIT',
      'Apache 2.0',
      'BSD 3-Clause',
      'BSD 2-Clause',
      'GNU GPL 3.0',
      'GNU LGPL 3.0',
      'Mozilla Public License 2.0'
    ]
  }
];

// license generator
const generator = function(name, choice) {
  const choicePath = chooseChoicePath(choice);
  touch('license');
  fs.readFile(`${choicePath}`, 'utf8', function(err, data) {
    if (err) {
      return console.log(error(err));
    }

    var foundStd;
    const stdLicenses = [
      'GNU GPL 3.0',
      'GNU LGPL 3.0',
      'Mozilla Public License 2.0'
    ];

    stdLicenses.forEach(function(license) {
      if (choice === license) {
        foundStd = true;
      } else {
        foundStd = false;
      }
    });

    if (!foundStd) {
      const today = new Date();
      const year = today.getFullYear();
      const text = `Copyright ${year} ${name}`;
      const result = data.replace(/Copyright/g, text);

      fs.writeFile('license', result , 'utf8', function(err) {
        if (err) return console.log(error(err));
        goodbye();
      });
    } else {
      fs.writeFile('license', data , 'utf8', function(err) {
        if (err) return console.log(error(err));
        goodbye();
      });
    }
  });
};

// choose choice path
const chooseChoicePath = function(choice) {
  switch (choice) {
    case 'MIT':
      return mitPath;
      break;
    case 'Apache 2.0':
      return apache2Path;
    case 'BSD 3-Clause':
      return bsd3Path;
    case 'BSD 2-Clause':
      return bsd2Path;
    case 'GNU GPL 3.0':
      return gpl3Path;
    case 'GNU LGPL 3.0':
      return lgpl3Path;
    case 'Mozilla Public License 2.0':
      return mpl2Path;
    default:
      return;
  };
};

// exit message
const goodbye = function() {
  console.log('');
  console.log(success(`Successfully created license! ${tada}`));
  process.exit(0);
};

// inquirer prompts
const mainPrompt = function() {
  return inquirer.prompt(mainQuestions).then(function(answers) {
    const { first_name, last_name } = answers;
    const fullName = `${first_name} ${last_name}`;
    listPrompt(fullName);
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
const listPrompt = function(fullName) {
  return inquirer.prompt(choices).then(function(answer) {
    generator(fullName, answer.choice_list);
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
