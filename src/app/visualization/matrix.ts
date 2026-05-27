import {Component} from '@angular/core';

@Component({
  selector: 'app-matrix',
  imports: [],
  template: `
    <div
      class="matrix"
    >
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      width: 100%;
      aspect-ratio: 1;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .matrix {
      position: relative;
      height: 90%;
      aspect-ratio: 1;

      background-color: var(--off);
      border: var(--border-width) solid var(--shield-color);
    }

    .matrix::after {
      content: "";
      pointer-events: none;

      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      border-radius: inherit;
      box-shadow: inset 0 0 calc(var(--unit-width) / 4) rgba(0,0,0,0.5);

      z-index: 30;
    }
  `,
})
export class Matrix {

}
