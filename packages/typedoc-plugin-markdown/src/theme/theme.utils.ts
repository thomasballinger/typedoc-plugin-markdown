export function escapeChars(str: string) {
  return str
    .replace(/>/g, '\\>')
    .replace(/_/g, '\\_')
    .replace(/`/g, '\\`')
    .replace(/\|/g, '\\|');
}

export function stripComments(str: string) {
  return str
    .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/g, ' ')
    .replace(/\n/g, '')
    .replace(/^\s+|\s+$|(\s)+/g, '$1');
}

export function stripLineBreaks(str: string) {
  return str
    ? str.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ').trim()
    : '';
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
    .join(' | ')} |\n${rows.map((row) => `| ${row.join(' | ')} \n`).join('')}`;
