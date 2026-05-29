import {Component, input} from '@angular/core';

import {ColorOrQuestion} from '../../../util/colorOrQuestion';


@Component({
  selector: 'app-bulb-text',
  imports: [],
  template: `
    <span
      class="text"
      [attr.data-color-fg]="color()"
    >{{text()}}</span>
  `,
  styles: `
    :host {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;

      display: flex ;
      align-items: center;
      justify-content: center;
    }

    .text {
      font-weight: bold;
      font-size: calc(0.6 * var(--unit-height));
      user-select: none;
    }
  `,
})
export class BulbText {
  readonly color = input.required<ColorOrQuestion>();
  readonly text = input.required<string>();
}
