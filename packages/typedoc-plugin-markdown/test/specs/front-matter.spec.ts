import { prependYAML } from 'typedoc-plugin-markdown';

describe(`FrontMatter:`, () => {
  test(`should prependYAML to doc content`, () => {
    expect(
      prependYAML('# Doc title\n\nDoc content', {
        stringProp: '"Escaped" title',
        booleanProp: true,
        numberProp: 2,
      }),
    ).toMatchSnapshot();
  });
});
