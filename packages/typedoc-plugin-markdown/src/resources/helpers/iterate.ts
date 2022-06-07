import * as Handlebars from 'handlebars/runtime';

export const iterate = (
  context: any,
  iterateKey: string,
  iterateValue: number,
  options: Handlebars.HelperOptions,
) => {
  return options.fn({
    ...context,
    [iterateKey]: iterateValue + 1,
  });
};
