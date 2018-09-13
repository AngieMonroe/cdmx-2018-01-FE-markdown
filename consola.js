const resolve = require('path').resolve;
const fs = require('fs');
const md = require('markdown-it')();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

const file = './README.md';
const arrayLinks = [];
let arrayLinksStatus = [];


// Verifica si la ruta es absoluta o relativa; si es relativa la convierte en absoluta.
const route = (file) => {
  return file = resolve(file);
};

route('./README.md');


// Lee un archivo md y lo convierte al formato utf8
const readFile = (callback) => {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    callback(data);
  });
};
readFile(callback = data => renderData(data));

// Convierte la data en formato HTML
const renderData = (data) => {
  const dataHtml = md.render(data);
  searchLinks(dataHtml);
};

// La Data se envía a la función que buscara los links con ayuda de JSDOM encuentro link y contenido de la etiqueta a
const searchLinks = (dataHtml) => {
  const dom = new JSDOM(`${dataHtml}`);
  const tags = dom.window.document.querySelectorAll('a[href]');
  for (let i = 0; i < tags.length; i++) {
    let objectLink = {
      href: tags[i].href,
      text: tags[i].textContent,
      file: route(file)
    };
    arrayLinks.push(objectLink);
  }
  // console.log(arrayLinks);
  // verificationLink(arrayLinks);
  optionValidate(arrayLinks);
  //return arrayLinks;
};

// Función para verificar los Links (Funciona pero modifica el primer arreglo)
const verificationLink = (arrayLinks) => {
  arrayLinks.forEach(link => {
    fetch(link.href)
      .then(res => {
        if (res.status === 404) {
          link.status = 'Fail 404';
        } else {
          link.status = 'Ok 200';
        }
        statsLinks(arrayLinks);
      });
  });
};

// Función para crear segundo arreglo de retorno
const optionValidate = (arrayLinks) => {
  arrayLinksStatus = arrayLinks.map(function (obj) {
    // return Object.defineProperty(obj, 'status', {
    //   value: '',
    //   writable: true,
    //   enumerable: true,
    //   configurable: true
    // });
    return {status : '', ...obj}
  });
  //console.log(arrayLinksStatus);
  arrayLinksStatus.forEach(link => {
    fetch(link.href)
      .then(res => {
        if (res.status === 404) {
          link.status = 'Fail 404';
        } else {
          link.status = 'Ok 200';
        }
        statsLinks(arrayLinksStatus);
        //console.log(arrayLinksStatus);
      });
  });
};

// Función para contar links correctos y rotos resultado de stats: true
const statsLinks = (arrayLinksStatus) => {
  console.log(arrayLinksStatus)
  const arrayStats =[];
  let unique = 0;
  let broken = 0;
  arrayLinksStatus.forEach(link => {
    if (link.status === 'Ok 200') {
      unique++;
    } else {
      broken++;
    }
  });
  const total = unique + broken;
  const objectStat = {
    total : total,
    unique : unique,
    broken : broken
  }
  arrayStats.push(objectStat)
  // console.log(arrayStats[0].total)
};

// Función para contar links correctos y rotos resultado de stats: true, validate:true
const statsAndValidate = (arrayLinks) => {
  let unique = 0;
  let broken = 0;
  arrayLinksStatus.forEach(link => {
    if (link.status === 'Ok 200') {
      unique++;
    } else {
      broken++;
    }
  });
  const total = unique + broken;
  return total, unique, broken;
};
