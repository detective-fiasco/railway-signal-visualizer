import {Component, computed, input} from '@angular/core';
import {ColorOrQuestion} from '../../dsl/types';

@Component({
  selector: 'app-lines',
  imports: [],
  template: `
    <div
      class="lines"
    >
      @for (color of colorsAtLeastOne(); track $index) {
        <div
          class="line"
          [attr.data-color-bg]="color"
        >
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      min-height: var(--unit-height);
      width: 100%;

    }

    .lines {
      width: 100%;
      padding: calc(var(--unit-height) * 0.075) 0;
    }

    .line {
      position: relative;
      width: 90%;

      border: var(--border-width) solid var(--shield-color);

      height: calc(var(--unit-height) * 0.4);
      margin: calc(var(--unit-height) * 0.05) auto;
    }

    .line:not([data-color-bg]) {
      background-color: var(--off);
    }

    .line::after {
      content: "";
      pointer-events: none;

      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      border-radius: inherit;
      box-shadow: inset 0 0 calc(var(--unit-height) / 8) rgba(0,0,0,0.5);

      z-index: 30;
    }

    .line:first-child {
      margin-top: 0;
    }
    .line:last-child {
      margin-bottom: 0;
    }

  `,
})
export class Lines {

  readonly colors = input.required<(ColorOrQuestion|null)[]>();

  readonly colorsAtLeastOne = computed(() => {
    const c = this.colors();
    if (c.length) return c;
    else return [ null ];
  })

}
