import * as fs from 'fs';
import * as path from 'path';
import {
  Application,
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  RendererEvent,
} from 'typedoc';
import { MarkdownTheme } from '../theme';
import { MarkdownThemeContext } from '../theme.context';

const BRACKETS = /\[\[([^\]]+)\]\]/g;
const INLINE_TAG =
  /(?:\[(.+?)\])?\{@(link|linkcode|linkplain)\s+((?:.|\n)+?)\}/gi;
const INCLUDE_PATTERN = /\[\[include:([^\]]+?)\]\]/g;
const MEDIA_PATTERN = /media:\/\/([^ "\)\]\}]+)/g;

export function load(app: Application) {
  let project: ProjectReflection;
  let context: MarkdownThemeContext;
  let includes: string;
  let media: string;

  app.renderer.on(RendererEvent.BEGIN, (event: RendererEvent) => {
    project = event.project;
    context = (app.renderer.theme as MarkdownTheme)?.getRenderContext();
    includes = context.options.includes;
    media = context.options.media;
  });

  app.renderer.on(PageEvent.END, (page: PageEvent) => {
    const reflection =
      page.model instanceof DeclarationReflection ? page.model : undefined;

    function replaceBrackets(text: string) {
      return text.replace(
        BRACKETS,
        (match: string, content: string): string => {
          const split = splitLinkText(content);
          return buildLink(match, split.target, split.caption);
        },
      );
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

      if (MarkdownTheme.URL_PREFIX.test(target)) {
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

    function insertIncludes(text: string) {
      return text.replace(
        INCLUDE_PATTERN,
        (match: string, includesPath: string) => {
          includesPath = path.join(includes!, includesPath.trim());
          if (
            fs.existsSync(includesPath) &&
            fs.statSync(includesPath).isFile()
          ) {
            return fs.readFileSync(includesPath, 'utf-8');
          } else {
            return '';
          }
        },
      );
    }

    function insertMedia(text: string) {
      return text.replace(MEDIA_PATTERN, (match: string, mediaPath: string) => {
        if (fs.existsSync(path.join(media!, mediaPath))) {
          return context.relativeURL('media') + '/' + mediaPath;
        } else {
          return match;
        }
      });
    }

    if (page.contents) {
      page.contents = replaceInlineTags(replaceBrackets(page.contents));

      if (includes) {
        page.contents = insertIncludes(page.contents);
      }

      if (media) {
        page.contents = insertMedia(page.contents);
      }
    }
  });
}
