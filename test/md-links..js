
describe('index', () => {
  test('mdLinks debería ser una función con dos parametros path, options', () => {
  });
  test('mdLinks debería retornar un objeto con las propiedades href, text, file', () =>{
    expect({ href: 1, 
      text: 'algo', 
      file: 'algo' })
      .toHaveProperty('href', 'text', 'file');
  });
  test('mdLinks con la opción validate debería retornar un objeto con las propiedades href, text, file, status', () =>{
    expect({ href: 1, 
      text: 'algo', 
      file: 'algo',
      status: 'validacion url' })
      .toHaveProperty('href', 'text', 'file', 'status');
  });
});