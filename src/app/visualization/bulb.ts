import {Component} from '@angular/core';

@Component({
  selector: 'app-bulb',
  imports: [],
  template: `
    <div
      class="bulb"
    >
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      height: var(--unit-height);
      aspect-ratio: 1;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bulb {
      position: relative;
      height: 80%;
      aspect-ratio: 1;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;
      background-color: var(--off);
      border: var(--border-width) solid var(--shield-color);
      overflow: hidden;
    }

    .bulb::after {
      content: "";
      pointer-events: none;

      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      border-radius: inherit;
      box-shadow: inset 0 0 calc(var(--unit-height) / 5) rgba(0,0,0,0.5);

      z-index: 30;
    }
  `,
})
export class Bulb {

}
