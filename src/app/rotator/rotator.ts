import {Component, contentChildren, effect, input, signal} from '@angular/core';

import {RotatorItem} from './rotator-item';


@Component({
  selector: 'app-rotator',
  imports: [ ],
  template: `
    <ng-content/>
  `
})
export class Rotator {
  items = contentChildren(RotatorItem);

  interval = input(1000);

  activeIndex = signal(0);

  constructor() {
    effect((onCleanup) => {
      const id = setInterval(() => {
        const items = this.items();
        const count = items.length;

        if (count <= 1) return;

        this.activeIndex.update(i => (i + 1) % count);
        this.applyVisibility();
      }, this.interval());

      onCleanup(() => clearInterval(id));
    });

    // initial run after content is available
    effect(() => {
      this.items(); // track
      queueMicrotask(() => this.applyVisibility());
    });
  }

  private applyVisibility() {
    const items = this.items();
    const active = this.activeIndex();

    items.forEach((item, i) => {
      const el = item.el.nativeElement;

      el.style.transition = 'opacity 300ms ease';
      el.style.opacity = i === active ? '1' : '0';
    });
  }
}
