import {Component, input} from '@angular/core';
import {ColorOrQuestion} from '../../../dsl/types';

@Component({
  selector: 'app-matrix-text',
  imports: [],
  template: `
    <span
      class="text"
      [class.small]="text().length > 1"
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

      overflow: hidden;
    }

    .text {
      font-weight: bold;
      font-size: calc(0.9 * var(--unit-width));
      user-select: none;
    }

    .small {
      font-size: calc(0.7 * var(--unit-width));
    }

  `,
})
export class MatrixText {

  readonly text = input.required<string>();
  readonly color = input.required<ColorOrQuestion>();

}
