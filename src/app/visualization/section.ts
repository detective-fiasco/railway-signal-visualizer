import {Component, input} from '@angular/core';

import {ColorOrQuestion} from '../../util/colorOrQuestion';


@Component({
  selector: 'app-section',
  imports: [ ],
  template: `
    <div
      class="section"
      [attr.data-color-bg]="color()"
    >
      <ng-content />
    </div>
  `,
  styles: `
    .section {
      position: relative;
      width: var(--unit-width);

      display: flex;
      align-items: center;
      justify-content: center;

      transition: background-color 0.2s ease;
      /*border: var(--border-width) solid var(--shield-color);*/
    }

    .section:not([data-color-bg]) {
      background-color: var(--shield-color);
    }

  `,
})
export class Section {
  color = input<ColorOrQuestion|undefined>();
}
