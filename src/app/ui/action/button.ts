import {Component, input, output, signal} from '@angular/core';

import {ColorOrQuestion} from '../../../util/colorOrQuestion';

export type Icon = 'add' | 'delete' | 'split' | 'join';

@Component({
  selector: 'app-action-button',
  imports: [],
  template: `
    <div
      class="container"
    >
      <button
        class="button"
        [class.hover]="isHover()"
        [attr.data-color-bg]="color()"
        (focus)="setHover(true)"
        (blur)="setHover(false)"
      ></button>
      <i
        class="fa-solid"
        [class.fa-plus]="icon() == 'add'"
        [class.fa-xmark]="icon() == 'delete'"
        [class.fa-scissors]="icon() == 'split'"
        [class.fa-down-left-and-up-right-to-center]="icon() == 'join'"
      ></i>
    </div>
  `,
  styles: `
    .container {
      position: relative;
      width: 30px;
      aspect-ratio: 1;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .button {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      width: 100%;
      aspect-ratio: 1;

      border: var(--border-width) solid var(--shield-color);
      border-radius: 50%;

      cursor: pointer;
      transition: width 0.2s ease, opacity 0.2s ease;
      opacity: 1;

      outline: none !important;
    }

    .button.hover {
      width: 115%;
    }
    .button:active {
      width: 95%;
    }

    i {
      position: relative;
      user-select: none;
      pointer-events: none;
      color: white;
    }
    [data-color-bg="W"] ~ i {
      color: black;
    }
    i.fa-down-left-and-up-right-to-center {
      transform: rotate(-45deg);
    }

  `,

  host: {
    '(mouseenter)': "setHover(true)",
    '(mouseleave)': "setHover(false)",
    '(click)': "$event.stopPropagation(); action.emit()",
  },

})
export class ActionButton {

  color = input<ColorOrQuestion>("W");
  icon = input.required<Icon>();

  hoverChange = output<boolean>();
  action = output();

  protected isHover= signal<boolean>(false);

  setHover(value: boolean) {
    this.hoverChange.emit(value);
    this.isHover.set(value);
  }

}
