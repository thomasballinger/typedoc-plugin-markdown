export class MarkdownString {
  lines: string[] = [];
  markdownString = '';

  ln(md: string) {
    this.markdownString = this.markdownString + '\n\n';
    this.lines.push(md);
  }

  space(md: string) {
    this.lines.push(md);
  }

  render(join: 'br' | 'space' = 'br') {
    return this.lines.join(join === 'br' ? '\n\n' : ' ');
  }

  render2() {
    return this.markdownString;
  }

  heading(level: number, text: string) {
    `${[...Array(level)].map(() => '#').join('')} ${text}`;
  }
}

export const heading = (level: number, text: string) =>
  `${[...Array(level)].map(() => '#').join('')} ${text}`;

export const link = (label: string, url: string) => `[${label}](${url})`;

export const bold = (text: string) => `**${text}**`;

export const backTicks = (text: string) => `\`${text}\``;

export const unorderedList = <T>(items: T[]) =>
  items.map((item) => `- ${item}`).join('\n');

export const horizontalRule = () => '---';

export const table = (headers: string[], rows: string[][]) =>
  `\n| ${headers.join(' | ')} |\n| ${headers
    .map(() => ':------')
    .join(' | ')} |\n${rows.map((row) => `| ${row.join(' | ')} |\n`).join('')}`;
