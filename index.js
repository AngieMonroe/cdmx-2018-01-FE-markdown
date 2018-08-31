const path = require('path');
const resolve = require('path').resolve;
const fs = require('fs');
const file = './README.md';
const md = require('markdown-it')();
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

// Verifica si la ruta es absoluta o relativa; si es relativa la convierte en absoluta.
const route = (file) => {
  let routeFile;
  if (path.isAbsolute(file)) {
    routeFile = file;
  } else {
    routeFile = resolve(file);
  }
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
readFile(callback = data => renderData(data));

// Busca los links que se encuentran en el readme por medio de una expresión regular.
const searchLink = (data) =>{
  let rex = /((http:\/\/|https:\/\/|www\.)[^\s]+)/gim;
  let rex2 = /\[(a-z)]/g;
  let links = data.match(rex);
  console.log(links);
};

// Convierte la data en formato HTML
const renderData = (data) => {
  let dataHtml = md.render(data);
  searchLinks(dataHtml);
};

// La Data se envía a la función que buscara los links con ayuda de JSDOM encuentro link y contenido de la etiqueta a
const searchLinks = (dataHtml) => {
  const dom = new JSDOM(`${dataHtml}`);
  let tags = dom.window.document.querySelectorAll('a[href]');
  for (let i = 0; i < tags.length; i++) {
    let text = tags[i].textContent;
    let href = tags[i].href;
  }
};

