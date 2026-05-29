import {Component, computed, input, output, signal} from '@angular/core';

import {ActionButton, Icon} from './button';
import {ColorOrQuestion} from '../../../util/colorOrQuestion';
import {Section} from '../../visualization/section';


@Component({
  selector: 'app-action-section',
  imports: [
    ActionButton,
    Section
  ],
  template: `
    <div
      class="section"
      [class.hoverable]="hoverColor()"
      [class.right]="position() === 'right'"
    >
      @if (primaryIcon()) {
        <div
          class="position"
          [class.hover]="isPrimaryHover()"
        >
          <app-action-button
            [icon]="primaryIcon()!"
            [color]="primaryColor()"
            (action)="primaryAction.emit()"
            (hoverChange)="isPrimaryHover.set($event)"
          />
        </div>
      }
      <app-section
        [color]="
            isPrimaryHover() ? primaryColor() :
            isBackgroundHover() ? hoverColor() :
            undefined
        "
      >
        <ng-content />
      </app-section>
    </div>
  `,
  styles: `
    .section {
      position: relative;
    }

    .section.hoverable {
      cursor: pointer;
    }

    .position {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 110;
    }

    .right .position {
      left: unset;
      right: 0;
      transform: translate(+50%, -50%);
    }

    .position.hover {
      z-index: 120;
    }
  `,
  host: {
    '(mouseenter)': "isHover.set(true)",
    '(mouseleave)': "isHover.set(false)",
    '(click)': "$event.preventDefault(); hoverAction.emit()",
  },
})
export class ActionSection {

  primaryIcon= input<Icon>();
  primaryColor = input<ColorOrQuestion>('W');
  primaryAction = output();

  hoverColor = input<ColorOrQuestion>();
  hoverAction = output();
  forceHover = input<boolean>(false);

  position = input<"left"|"right">("left");

  protected isHover= signal<boolean>(false);
  protected isPrimaryHover= signal<boolean>(false);
  protected isBackgroundHover = computed(
    () => (this.isHover() && !this.isPrimaryHover()) || this.forceHover()
  );
}
