import {Component, input} from '@angular/core';

@Component({
  selector: 'app-edge',
  imports: [ ],
  template: `
    <div
      class="edge"
      [class.top]="type() == 'top'"
      [class.bottom]="type() == 'bottom'"
    >
    </div>
  `,
  styles: `
    .edge {
      position: relative;
      width: var(--unit-width);
      height: calc(var(--unit-height) / 3);

      display: flex;
      align-items: center;
      justify-content: center;

      background-color: var(--shield-color);
      transition: background-color 0.2s ease;
    }

    .edge.top {
      border-top-left-radius: 50%;
      border-top-right-radius: 50%;
    }

    .edge.bottom {
      border-bottom-left-radius: 50%;
      border-bottom-right-radius: 50%;
    }

  `,
})
export class Edge {
  type = input.required<"top"|"bottom">();

}
