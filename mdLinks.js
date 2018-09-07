const path = require('path');
const fs = require('fs');
const md = require('markdown-it')();
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const fetch = require('node-fetch');

const file = './README.md';

const mdLinks = (file) => {
  return new Promise((resolve, reject) => {
    if (file) {
      resolve(file);
    } else {
      reject('Error en MDLINKS');
    }
  });
};

mdLinks(file)
  .then(result => route(result))
  .then(result => readFile(result))
  .then(result => renderData(result))
  .then(result => searchLinks(result))
  .then(result => optionValidate(result))
  .then(result => optionStats(result))
  .then(result => optionStatsAndValidate(result))
  .catch(err => {
    console.log('Ocurrio un error', err);
  });

// Verifica la ruta y la convierte en absoluta.
function route(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject('Error en route');
    return resolve(path.resolve(file));
  });
};

// Lee un archivo md y lo convierte al formato utf8.
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (error, data) => {
      if (error) return reject(error);
      return resolve(data);
    });
  });
}

// Convierte la data en formato HTML.
function renderData(data) {
  return new Promise((resolve, reject) => {
    if (!data) return reject('Error al leer el archivo');
    return resolve(md.render(data));
  });
};

// La Data con ayuda de JSDOM  que convierte el HTML en un objeto, se solicitan todas las etiquetas de tipo <a>
// y después se iteran para sacar la información que se necesita la cual se va colocando en un objeto para formar
// un arreglo.
function searchLinks(dataHtml) {
  return new Promise((resolve, reject) => {
    if (!dataHtml) return reject('Error al convertir la data a Html');
    const arrayLinks = [];
    const dom = new JSDOM(`${dataHtml}`);
    const tags = dom.window.document.querySelectorAll('a[href]');
    for (let i = 0; i < tags.length; i++) {
      let objectLink = {
        href: tags[i].href,
        text: tags[i].textContent,
        file: path.resolve(file)
      };
      arrayLinks.push(objectLink);
    }
    console.log(arrayLinks);
    return resolve(arrayLinks);
  }); 
};

// Con el resultado de la función searchLinks se realiza un map y por medio de Object.defineProperty se establece
// la nueva propiedad que contendrá este nuevo arreglo. Después se itera el arreglo para agregar el status.
function optionValidate(arrayLinks) {
  return new Promise((resolve, reject) => {
    if ('No tiene opciónValidate') return reject('No eligió la opción');
    let arrayLinksStatus = arrayLinks.map(function(obj) {
      return Object.defineProperty(obj, 'status', {
        value: '',
        writable: true,
        enumerable: true,
        configurable: true
      });
      // return {status : '', ...obj}
    });
    arrayLinksStatus.forEach(link => {
      fetch(link.href)
        .then(res => {
          if (res.status === 404) {
            link.status = 'Fail 404';
          } else {
            link.status = 'Ok 200';
          }
          return resolve(arrayLinksStatus);
        });
    });
  });
};

// Con el resultado de la función optionValidate se realizan las estadisticas de los links. Stats: true
function optionStats(arrayLinksStatus) {
  return new Promise((resolve, reject) => {
    if ('No tiene opción Stats') return reject('No eligio la opción stats');
    const arrayStats = [];
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
      total: total,
      unique: unique,
      broken: broken
    };
    arrayStats.push(objectStat);
    return resolve(arrayStats);
  });  
};


// Función para contar links correctos y rotos resultado de stats: true, validate:true
function optionStats(arrayLinksStatus) {
  return new Promise((resolve, reject) => {
    if ('No tiene opción Stats') return reject('No eligio la opción stats');
    const arrayStats = [];
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
      total: total,
      unique: unique,
      broken: broken
    };
    arrayStats.push(objectStat);
    return resolve(arrayStats);
  });  
};