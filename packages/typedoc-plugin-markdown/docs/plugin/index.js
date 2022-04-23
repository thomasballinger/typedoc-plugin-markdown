const knownSymbols = {
  DeclarationReflection:
    'https://typedoc.org/api/classes/DeclarationReflection.html',
  Comment: 'https://typedoc.org/api/classes/Comment.html',
  Options: 'https://typedoc.org/api/classes/Options.html',
  PageEvent: 'https://typedoc.org/api/classes/PageEvent.html',
  ProjectReflection: 'https://typedoc.org/api/classes/ProjectReflection.html',
  Reflection: 'https://typedoc.org/api/classes/Reflection.html',
  Renderer: 'https://typedoc.org/api/classes/Renderer.html',
  Theme: 'https://typedoc.org/api/classes/Theme.html',
  TypeDocOptions: 'https://typedoc.org/api/modules.html#TypeDocOptions',
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
