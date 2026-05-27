import {Component, input} from '@angular/core';
import {Bulb} from '../../visualization/bulb';
import {BulbFull} from '../../visualization/bulb/full';
import {BulbText} from '../../visualization/bulb/text';
import {Lines} from '../../visualization/lines';
import {Matrix} from '../../visualization/matrix';
import {MatrixIcon} from '../../visualization/matrix/icon';
import {MatrixLines} from '../../visualization/matrix/lines';
import {MatrixText} from '../../visualization/matrix/text';
import {Rotator} from '../../rotator/rotator';
import {RotatorItem} from '../../rotator/rotator-item';

import {ColorOrQuestion, LineState, MatrixState, Module} from '../../../dsl/types'
import {WithIds} from './util';

@Component({
  selector: 'app-editor-module',
  imports: [
    Bulb,
    BulbFull,
    BulbText,
    Lines,
    Matrix,
    MatrixIcon,
    MatrixLines,
    MatrixText,
    Rotator,
    RotatorItem
  ],
  template: `
    @let module = structure();
    @switch (module.kind) {
      @case ("module-bulb") {
        <app-bulb>
          <app-rotator>
            @for (state of module.content; track state.id) {
              @switch (state.kind) {
                @case ("state-unknown") {
                  <app-bulb-text rotator-item [color]="state.color" text="?"/>
                }
                @case ("state-full") {
                  <app-bulb-full rotator-item [color]="state.color"/>
                }
                @case ("state-letter") {
                  <app-bulb-text rotator-item [color]="state.color" [text]="state.shape"/>
                }
                @case ("state-number") {
                  <app-bulb-text rotator-item [color]="state.color" [text]="state.shape"/>
                }
              }
            } @empty {
              <app-bulb-full rotator-item color="?"/>
            }
          </app-rotator>
        </app-bulb>
      }
      @case ("module-line") {
        <app-lines [colors]="calculateColorsArrayForLinesModule(module.content)"/>
      }
      @case ("module-matrix") {
        @let colors = calculateLineColorsArrayForMatrixModule(module.content);
        @let states = calculateNonLineStatesForMatrixModule(module.content);
        <app-matrix>
          <app-rotator>
            @if (colors.length) {
              <app-matrix-lines rotator-item [colors]="colors"/>
            }
            @for (state of states; track state.id) {
              @switch (state.kind) {
                @case ("state-unknown") {
                  <app-matrix-text rotator-item [color]="state.color" text="?"/>
                }
                @case ("state-letter") {
                  <app-matrix-text rotator-item [color]="state.color" [text]="state.shape"/>
                }
                @case ("state-number") {
                  <app-matrix-text rotator-item [color]="state.color" [text]="state.shape"/>
                }
                @case ("state-icon") {
                  <app-matrix-icon rotator-item [color]="state.color" [icon]="state.shape"/>
                }
              }
            }
          </app-rotator>
        </app-matrix>
      }
    }
  `,
  styles: `
    :host {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `,
})
export class EditorModule {

  structure = input.required<WithIds<Module>>();

  calculateColorsArrayForLinesModule(states: WithIds<LineState>[]): (ColorOrQuestion|null)[] {
    const colors = states.map(state => state.kind === "state-full" ? state.color : null)
    if (colors.length) return colors;
    return [ "?" ];
  }

  calculateLineColorsArrayForMatrixModule(states: WithIds<MatrixState>[]): (ColorOrQuestion|null)[] {
    const colors = states
      .filter(state => state.kind === "state-line")
      .map(state => state.color) as ColorOrQuestion[];
    const merged = [...colors].sort().join("");

    if (merged === "GGY")
      return ["G", "Y", null, "G"]
    if (merged === "GG")
      return ["G", null, null, "G"]
    if (merged === "GY")
      return ["G", "Y"]
    return colors
  }

  calculateNonLineStatesForMatrixModule(states: WithIds<MatrixState>[]) {
    return states.filter(state => state.kind !== 'state-line');
  }

}
