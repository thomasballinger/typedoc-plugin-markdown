import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import { Reflection } from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';

const URL_PREFIX = /^(http|ftp)s?:\/\//;
const BRACKETS = /\[\[([^\]]+)\]\]/g;
const INLINE_TAG =
  /(?:\[(.+?)\])?\{@(link|linkcode|linkplain)\s+((?:.|\n)+?)\}/gi;
const INCLUDE_PATTERN = /\[\[include:([^\]]+?)\]\]/g;
const MEDIA_PATTERN = /media:\/\/([^ "\)\]\}]+)/g;

export function commentPartial(context: MarkdownThemeContext, text: string) {
  const { includes, media } = context.options;
  const project = context.project();
  const reflection = context.reflection();

  function replaceBrackets(text: string) {
    return text.replace(BRACKETS, (match: string, content: string): string => {
      const split = splitLinkText(content);
      return buildLink(match, split.target, split.caption);
    });
  }

  function replaceInlineTags(text: string): string {
    return text.replace(
      INLINE_TAG,
      (match: string, leading: string, tagName: string, content: string) => {
        const split = splitLinkText(content);
        const target = split.target;
        const caption = leading || split.caption;

        return buildLink(match, target, caption, tagName === 'linkcode');
      },
    );
  }

  function buildLink(
    original: string,
    target: string,
    caption: string,
    monospace = false,
  ) {
    if (monospace) {
      caption = '`' + caption + '`';
    }

    if (URL_PREFIX.test(target)) {
      return `[${caption}](${target})`;
    }

    let targetReflection: Reflection | undefined;
    if (reflection) {
      targetReflection = reflection.findReflectionByName(target);
    } else if (project) {
      targetReflection = project.findReflectionByName(target);
    }

    if (targetReflection && targetReflection.url) {
      return `[${caption}](${Handlebars.helpers.relativeURL(
        targetReflection.url,
      )})`;
    } else {
      return original;
    }
  }

  function splitLinkText(text: string) {
    let splitIndex = text.indexOf('|');
    if (splitIndex === -1) {
      splitIndex = text.search(/\s/);
    }
    if (splitIndex !== -1) {
      return {
        caption: text
          .substr(splitIndex + 1)
          .replace(/\n+/, ' ')
          .trim(),
        target: text.substr(0, splitIndex).trim(),
      };
    } else {
      return {
        caption: text,
        target: text,
      };
    }
  }

  if (includes) {
    text = text.replace(
      INCLUDE_PATTERN,
      (match: string, includesPath: string) => {
        includesPath = path.join(includes!, includesPath.trim());
        if (fs.existsSync(includesPath) && fs.statSync(includesPath).isFile()) {
          return fs.readFileSync(includesPath, 'utf-8');
        } else {
          return '';
        }
      },
    );
  }

  if (media) {
    text = text.replace(MEDIA_PATTERN, (match: string, mediaPath: string) => {
      if (fs.existsSync(path.join(media!, mediaPath))) {
        return Handlebars.helpers.relativeURL('media') + '/' + mediaPath;
      } else {
        return match;
      }
    });
  }

  return replaceInlineTags(replaceBrackets(text));
}
