import {Component, signal, computed, inject, effect, untracked} from '@angular/core';

import {ActionBar} from './ui/action/bar';
import {ActionSection} from './ui/action/section';

import {Section} from './visualization/section';
import {Edge} from './visualization/edge';

import {Bulb} from './visualization/bulb';
import {BulbFull} from './visualization/bulb/full';
import {BulbText} from './visualization/bulb/text';

import {Matrix} from './visualization/matrix';
import {MatrixText} from './visualization/matrix/text';
import {MatrixLines} from './visualization/matrix/lines';
import {MatrixIcon} from './visualization/matrix/icon';

import {Lines} from './visualization/lines';

import {Rotator} from './rotator/rotator';
import {RotatorItem} from './rotator/rotator-item';
import {parse} from '../dsl/parse';


import {form, FormField} from '@angular/forms/signals';
import {UrlState} from './url-state';
import {derivedSignal} from '../util/derivedSignal';
import {format} from '../dsl/format';
import {Editor} from './ui/editor/editor';
import {pathFormat} from '@angular-devkit/schematics/src/formats';
import {serialize} from '../dsl/serialize';



@Component({
  selector: 'app-root',
  imports: [ FormField, Editor ],
  template: `
    <div>
      <input type="radio" [formField]="pathForm" value="normal" id="path-normal" />
      <label for="path-normal">normal</label>
      <input type="radio" [formField]="pathForm" value="dwarf" id="path-dwarf"/>
      <label for="path-dwarf">dwarf</label>
    </div>
    <div>
      <input [formField]="hashForm" [attr.data-color-bg]="parse(hashInput()) ? undefined : 'R'" style="font-family: monospace"/>
    </div>
    <div>
      <input readonly [value]="format(hashInput())" style="font-family: monospace; background-color: lightgray"/>
    </div>
<!--    <pre>&nbsp;{{format(text())}}&nbsp;</pre>-->
<!--    <pre style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none">{{JSON.stringify(parse(text()),null,4)}}</pre>-->

    <div style="margin-bottom: 50px"></div>

    <app-editor [(structure)]="hash" [(mode)]="mode"/>
  `,
  styles: `
  `
})
export class App {
  urlState = inject(UrlState);

  hash = this.urlState.hash;

  path = this.urlState.path;
  mode = derivedSignal({
    source: this.path,
    toDerived: (s: string) => s === "dwarf" ? "dwarf" : "normal",
    toSource: (d: "normal" | "dwarf") => d
  });

  constructor() {
    effect(() => {
      const path = this.path()
      if (path !== "dwarf" && path !== "normal")
        this.path.set("normal");
    });
  }



  hashInput = derivedSignal<string, string>({
    source: this.hash,
    toDerived: (s: string) => s,
    toSource: (d, s) => {
      const p = parse(d);
      if (!p) return s;
      return d;
    }
  })

  hashForm = form(this.hashInput);
  pathForm = form(this.path);

  protected readonly parse = parse;
  protected readonly format = format;
  protected readonly JSON = JSON;
  protected readonly pathFormat = pathFormat;
}
