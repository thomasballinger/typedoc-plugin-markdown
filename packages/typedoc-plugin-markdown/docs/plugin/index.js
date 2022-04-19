const knownSymbols = {
  ProjectReflection: 'https://typedoc.org/api/classes/ProjectReflection.html',
  Theme: 'https://typedoc.org/api/classes/Theme.html',
  Reflection: 'https://typedoc.org/api/classes/Reflection.html',
  Renderer: 'https://typedoc.org/api/classes/Renderer.html',
  UrlMapping: 'https://typedoc.org/api/classes/UrlMapping.html',
};

module.exports = {
  load: (app) => {
    app.renderer.addUnknownSymbolResolver('typedoc', (name) => {
      // eslint-disable-next-line no-prototype-builtins
      if (knownSymbols.hasOwnProperty(name)) {
        return knownSymbols[name];
      }
    });
  },
};
