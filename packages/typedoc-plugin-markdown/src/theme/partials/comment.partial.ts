import * as fs from 'fs';
import * as path from 'path';
import { Comment, Reflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';

const URL_PREFIX = /^(http|ftp)s?:\/\//;
const BRACKETS = /\[\[([^\]]+)\]\]/g;
const INLINE_TAG =
  /(?:\[(.+?)\])?\{@(link|linkcode|linkplain)\s+((?:.|\n)+?)\}/gi;
const INCLUDE_PATTERN = /\[\[include:([^\]]+?)\]\]/g;
const MEDIA_PATTERN = /media:\/\/([^ "\)\]\}]+)/g;

export function commentPartial(
  context: MarkdownThemeRenderContext,
  comment: Comment,
) {
  const md: string[] = [];

  if (comment?.hasVisibleComponent()) {
    if (comment.shortText) {
      md.push(parseComment(context, comment.shortText));
    }

    if (comment.text) {
      md.push(parseComment(context, comment.text));
    }

    if (comment.tags) {
      const tags = comment.tags.map(
        (tag) =>
          `**\`${tag.tagName}\`**${
            tag.text ? (tag.text.startsWith('\n') ? '' : ' ') + tag.text : ''
          }`,
      );
      md.push(tags.join('\n\n'));
    }

    return md.join('\n\n');
  }

  return '';
}

function parseComment(
  context: MarkdownThemeRenderContext,
  commentText: string,
) {
  let parsedComments = replaceInlineTags(context, commentText);

  parsedComments = replaceBrackets(context, parsedComments);

  if (context.options.includes) {
    parsedComments = insertIncludes(context, parsedComments);
  }

  if (context.options.media) {
    parsedComments = insertMedia(context, parsedComments);
  }

  return parsedComments;
}

function replaceBrackets(context: MarkdownThemeRenderContext, text: string) {
  return text.replace(BRACKETS, (match: string, content: string): string => {
    const split = splitLinkText(content);
    return buildLink(context, match, split.target, split.caption);
  });
}

function replaceInlineTags(
  context: MarkdownThemeRenderContext,
  text: string,
): string {
  return text.replace(
    INLINE_TAG,
    (match: string, leading: string, tagName: string, content: string) => {
      const split = splitLinkText(content);
      const target = split.target;
      const caption = leading || split.caption;

      return buildLink(context, match, target, caption, tagName === 'linkcode');
    },
  );
}

function buildLink(
  context: MarkdownThemeRenderContext,
  original: string,
  target: string,
  caption: string,
  monospace = false,
) {
  const reflection = context.activeReflection;
  const project = context.project;

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
    return `[${caption}](${context.urlTo(targetReflection)})`;
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

function insertIncludes(context: MarkdownThemeRenderContext, text: string) {
  return text.replace(
    INCLUDE_PATTERN,
    (match: string, includesPath: string) => {
      includesPath = path.join(context.options.includes!, includesPath.trim());
      if (fs.existsSync(includesPath) && fs.statSync(includesPath).isFile()) {
        return fs.readFileSync(includesPath, 'utf-8');
      } else {
        return '';
      }
    },
  );
}

function insertMedia(context: MarkdownThemeRenderContext, text: string) {
  return text.replace(MEDIA_PATTERN, (match: string, mediaPath: string) => {
    if (fs.existsSync(path.join(context.options.media!, mediaPath))) {
      return context.relativeURL('media') + '/' + mediaPath;
    } else {
      return match;
    }
  });
}
