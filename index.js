const path = require('path');
const resolve = require('path').resolve;
const fs = require('fs');
var url = require('url');
const file = './README.md';

// Verifica si la ruta es absoluta o relativa; si es relativa la convierte en absoluta.
const route = (file) => {
  let routeFile;
  if (path.isAbsolute(file)) {
    routeFile = file;
  } else {
    routeFile = resolve(file);
  }
  console.log(routeFile)
  return routeFile;
};

route('./README.md');

const mdLinks = (path, options) => {

};

// Lee un archivo md y lo convierte al formato utf8
const readFile = (callback) => {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) throw err;
    callback(data);
  });
};
readFile(callback = data => searchLink(data));

// Busca los links que se encuentran en el readme por medio de una expresión regular.
const searchLink = (data) =>{
  let rex = /((http:\/\/|https:\/\/|www\.)[^\s]+)/gim;
  // let rex2 = /\[.\]/
  let links = data.match(rex);
  console.log(links);
};