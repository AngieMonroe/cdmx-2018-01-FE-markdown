const path = require('path');
const fs = require('fs');
const md = require('markdown-it')();
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const fetch = require('node-fetch');
const file = './README.md';

// Verifica que exista una ruta
const mdLinks = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('Error en MDLINKS');
    } else {
      resolve(file);
    }
  });
};

mdLinks(file)
  .then(result => route(result))
  .then(result => readFile(result))
  .then(result => renderData(result))
  .then(result => searchLinks(result))
  .then(result => createArray(result))
  .then(result => createPropertyStatus(result))
  .then(result => optionValidate(result))
  .then(result => optionStats(result))
  .then(result => optionStatsAndValidate(result))
  .catch(err => {
    console.log('Ocurrio un error', err);
  });

// Verifica la ruta y la convierte en absoluta.
function route(file) {
  return new Promise((resolve, reject) => {
    if (!file)  return reject('Error en route');
     return resolve(path.resolve(file));
  });
};

// Lee un archivo y lo convierte al formato utf8(data).
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

// Convierte la data en un objeto y busca todas las etiquetas <a>
function searchLinks(dataHtml) {
  return new Promise((resolve, reject) => {
    if (!dataHtml) return reject('Error al convertir la data a Html');
    const tags = new JSDOM(`${dataHtml}`).window.document.querySelectorAll('a[href]');
    return resolve(tags);
  }); 
};

// Crea un arreglo de objetos con el objeto de etiquetas
function createArray(tags) {
  return new Promise((resolve, reject) => {
    if (!tags) return reject('Error en el arreglo de etiquetas');
    let arrayLinks = [];
    for (let tag of tags) {
      arrayLinks.push({href: tag.href, text: tag.textContent, file: path.resolve(file)});
    }
    return resolve(arrayLinks);
    });
};


// Crea una nueva propiedad a los objetos del arreglo en un nuevo arreglo.
function createPropertyStatus(arrayLinks) {
  return new Promise((resolve, reject) => {
    if (!arrayLinks) return reject('No eligió la opción validate');
    let arrayLinksStatus = arrayLinks.map(function(obj) {
      return {...obj, status : ''}
    });
    return resolve(arrayLinksStatus);
  });
};

// Función validación de links
function optionValidate(arrayLinksStatus){
  return new Promise((resolve, reject) => {
    if(!arrayLinksStatus) return reject('No se creo la opción status');
    const arrayLinksValidate = arrayLinksStatus.map(url => fetch(url));
    Promise.all(arrayLinksValidate)
    .then(function(arrayOfResults){
      arrayOfResults.forEach(response => 
        arrayLinksStatus.forEach(link => link.status = `${response.status} ${response.statusText}`));
        return resolve(arrayLinksStatus)
    })
  })
}

// // Valida los status de links
// function optionValidate(arrayLinksStatus){
//   return new Promise((resolve, reject) => {
//     if(!arrayLinksStatus) return reject('No se creo la propiedad status');
//     arrayLinksStatus.forEach(link => {
//       fetch(link.href)
//         .then(response => {
//           link.status = `${response.status} ${response.statusText}`
//           // console.log(arrayLinksStatus)
//           // return resolve(arrayLinksStatus)
//           // return resolve(optionStats(arrayLinksStatus));
//       });
//     });
//     // Cierra for
//   });
// };

// Con el resultado de la función optionValidate se realizan las estadisticas de los links. Stats: true
function optionStats(arrayLinksStatus) {
  console.log(arrayLinksStatus)
  return new Promise((resolve, reject) => {
    if (!arrayLinksStatus) return reject('No eligio la opción stats');
    let unique = 0;
    let broken = 0;
    arrayLinksStatus.forEach(link => {
      if (link.status === 'Ok 200') {
        unique++;
      } else {
        broken++;
      }
    });
    const arrayStats = [{total: arrayLinksStatus.length, unique, broken}]
    console.log(arrayStats)
    return resolve(arrayStats)
  });  
};


// Función para contar links correctos y rotos resultado de stats: true, validate:true
function optionStatsAndValidate(arrayStats) {
  console.log(arrayStats)
  return new Promise((resolve, reject) => {
    if (!arrayStats) return reject('No paso el arreglo de stats');
    return resolve(arrayStats);
  });  
};

module.exports =  mdLinks;