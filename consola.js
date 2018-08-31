console.log('hola mundo');

// Busca los links que se encuentran en el readme por medio de una expresión regular.
const searchLink = (data) =>{
  let rex = /((http:\/\/|https:\/\/|www\.)[^\s]+)/gim;
  let rex2 = /\[(a-z)]/g;
  let links = data.match(rex2);
  console.log(links);
};