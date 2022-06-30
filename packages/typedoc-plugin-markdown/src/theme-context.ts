import * as path from 'path';
import { Options, ReferenceType, Reflection } from 'typedoc';
import { URL_PREFIX } from './constants';
import { TypedocPluginMarkdownOptions } from './models';
import { partials, templates } from './resources';
import { MarkdownTheme } from './theme';

export class MarkdownThemeRenderContext {
  private _activeLocation: string;
  // private _project: ProjectReflection;
  private _globalsFile = 'modules.md';

  /*set project(project: ProjectReflection) {
    this._project = project;
  }

  get project() {
    return this._project;
  }
*/
  set activeLocation(activeLocation: string) {
    this._activeLocation = activeLocation;
  }

  get activeLocation() {
    return this._activeLocation;
  }

  set globalsFile(globalsFile: string) {
    this._globalsFile = globalsFile;
  }

  get globalsFile() {
    return this._globalsFile;
  }

  constructor(private theme: MarkdownTheme, public options: Options) {}

  getOption<K extends keyof TypedocPluginMarkdownOptions>(name: K) {
    return this.options.getValue(name) as TypedocPluginMarkdownOptions[K];
  }

  attemptExternalResolution = (type: ReferenceType) => {
    return this.theme.owner.attemptExternalResolution(type);
  };

  urlTo = (reflection: Reflection) => this.relativeURL(reflection.url);

  relativeURL(url: string | undefined) {
    if (!url) {
      return null;
    }
    if (URL_PREFIX.test(url)) {
      return url;
    } else {
      const relative = path.relative(
        path.dirname(this.activeLocation),
        path.dirname(url),
      );
      return path.join(relative, path.basename(url)).replace(/\\/g, '/');
    }
  }

  templates = templates(this);
  partials = partials(this);
}
