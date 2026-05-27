import {Component, input} from '@angular/core';
import {ColorOrQuestion} from '../../../dsl/types';

@Component({
  selector: 'app-bulb-full',
  imports: [],
  template: `
    <div
      class="full"
      [attr.data-color-bg]="color()"
    ></div>
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

    .full {
      width: 100%;
      height: 100%;
    }
  `,
})
export class BulbFull {
  readonly color = input.required<ColorOrQuestion>();

}
