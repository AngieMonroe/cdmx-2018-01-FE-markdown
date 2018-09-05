const resolve = require('path').resolve;
const fs = require('fs');
const md = require('markdown-it')();
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const fetch = require('node-fetch');

const path = './README.md';
const arrayLinks = [];
let arrayLinksStatus = [];


const mdLinks = (path) => {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
      console.log(data);
    });
  });
};

mdLinks(path)