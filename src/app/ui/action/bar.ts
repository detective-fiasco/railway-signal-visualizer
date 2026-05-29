import {Component, input, output, signal} from '@angular/core';

import {ActionButton, Icon} from './button';
import {ColorOrQuestion} from '../../../util/colorOrQuestion';


@Component({
  selector: 'app-action-bar',
  imports: [
    ActionButton
  ],
  template: `
    <div
      class="bar"
      [class.hover]="isPrimaryHover() || isSecondaryHover()"
      [class.rounded]="rounded()"
      [class.right]="position() === 'right'"
    >
      <div
        class="position primary"
        [class.hover]="isPrimaryHover()"
      >
        <app-action-button
          [icon]="primaryIcon()"
          [color]="primaryColor() ?? 'W'"
          (action)="primaryAction.emit()"
          (hoverChange)="isPrimaryHover.set($event)"
        />
      </div>

      @if (secondaryIcon()) {
        <div
          class="position secondary"
          [class.hover]="isSecondaryHover()"
        >
          <app-action-button
            [icon]="secondaryIcon()!"
            [color]="secondaryColor() ?? 'W'"
            (action)="secondaryAction.emit()"
            (hoverChange)="isSecondaryHover.set($event)"
          />
        </div>
      }
      <div
        class="line"
        [attr.data-color-bg]="
            isPrimaryHover() ? primaryColor() :
            isSecondaryHover() ? secondaryColor() :
            undefined
        "
      >
      </div>
    </div>
  `,
  styles: `
    .bar {
      display: flex;
      align-items: stretch;
      position: relative;

      width: var(--unit-width);
      height: 0;
    }

    .position.primary {
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-50%, -50%);
      z-index: 111;
    }

    .right .position.primary {
      left: unset;
      right: 0;
      transform: translate(+50%, -50%);
    }

    .position.secondary {
      position: absolute;
      left: 20px;
      top: 10px;
      transform: translate(-50%, -50%);
      z-index: 110;
    }

    .right .position.secondary {
      left: unset;
      right: -20px;
      transform: translate(+50%, -50%);
    }


    .position.hover {
      z-index: 120;
    }

    .line {
      position: absolute;
      transform: translateY(-50%);

      z-index: 100;

      height: 0;
      width: 100%;

      transition: height 0.1s ease, background-color 0.5s ease;
    }

    .rounded .line {
      border-radius: calc(var(--action-bar-height) / 2);
    }

    .hover .line {
      height: var(--action-bar-height);
      transition: height 0.1s ease, background-color 0.2s ease;
    }
  `,
})
export class ActionBar {

  rounded = input<boolean>(false);
  position = input<"left"|"right">("left");

  primaryIcon= input.required<Icon>();
  primaryColor = input<ColorOrQuestion|undefined>();
  primaryAction = output();

  secondaryIcon = input<Icon|undefined>();
  secondaryColor = input<ColorOrQuestion|undefined>();
  secondaryAction = output();

  protected isPrimaryHover= signal<boolean>(false);
  protected isSecondaryHover= signal<boolean>(false);
}
