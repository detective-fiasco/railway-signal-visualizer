import {Component, input} from '@angular/core';
import {ColorOrQuestion} from '../../../dsl/types';

@Component({
  selector: 'app-matrix-lines',
  imports: [],
  template: `
    @for (color of colors(); track $index) {
      <div
        class="line"
        [attr.data-color-bg]="color"
      >
      </div>
    }
  `,
  styles: `
    :host {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .line {
      width: 90%;
      height: 15%;
      margin: 5%;
    }

  `,
})
export class MatrixLines {

  readonly colors = input.required<(ColorOrQuestion|null)[]>();

}
