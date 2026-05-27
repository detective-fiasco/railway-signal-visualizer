import {Component, input} from '@angular/core';
import {ColorOrQuestion, Icon} from '../../../dsl/types';

@Component({
  selector: 'app-matrix-icon',
  imports: [],
  template: `
    <div
      [attr.data-color-fg]="color()"
      [class.humping]="icon() == 'humping'"
      [class.cross]="icon() == 'cross'"
    ></div>
  `,
  styles: `
    :host {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .humping {
      border: solid calc(0.12 * var(--unit-width)) currentColor;
      border-top-left-radius: 50%;
      border-top-right-radius: 50%;
      border-bottom: none;

      width: 80%;
      height: 80%;
    }

    .cross {
      width: 100%;
      height: 100%;
    }
    .cross::before, .cross::after {
      content: ' ';
      user-select: none;

      position: absolute;
      top: 50%;
      left: 50%;

      width: calc(0.12 * var(--unit-width));
      height: 110%;

      background-color: currentColor;
    }
    .cross::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    .cross::after {
      transform: translate(-50%, -50%) rotate(45deg);
    }
  `,
})
export class MatrixIcon {

  readonly color = input.required<ColorOrQuestion>();
  readonly icon = input.required<Icon>();

}
