import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[rotator-item]',
})
export class RotatorItem {
  constructor(public el: ElementRef<HTMLElement>) {}

}
