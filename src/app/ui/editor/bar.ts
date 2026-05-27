import {Component, computed, input, output} from '@angular/core';
import {ActionBar} from '../action/bar';
import {Color} from '../../../dsl/types';

@Component({
  selector: 'app-editor-bar',
  imports: [
    ActionBar
  ],
  template: `
    @let actions = combined();
    @if (actions.length > 0) {
      <app-action-bar
        [primaryIcon]="actions[0]"
        [primaryColor]="getColorFor(actions[0])"
        (primaryAction)="doAction(actions[0])"
        [secondaryIcon]="actions[1]"
        [secondaryColor]="getColorFor(actions[1])"
        (secondaryAction)="doAction(actions[1])"

        [rounded]="rounded()"
        [position]="position()"
      />
    }
  `,



})
export class EditorBar {
  rounded = input(false);
  position = input<"left"|"right">("left");

  add = input(false);
  split = input(false);
  join = input(false);

  combined = computed(() => {
    let actions: ("add" | "split" | "join")[] = [];

    if (this.add())
      actions.push("add");
    if (this.split())
      actions.push("split");
    if (this.join() && actions.length < 2)
      actions.push("join");

    return actions;
  })

  getColorFor(action: ("add" | "split" | "join" | undefined)) {
    return ({
      add: "W",
      split: "B",
      join: "G"
    } as const)[action ?? "add"];
  }

  doAction(action: ("add" | "split" | "join")) {
    switch (action) {
      case "add":
        this.actionAdd.emit();
        break;
      case "split":
        this.actionSplit.emit();
        break;
      case "join":
        this.actionJoin.emit();
        break;
    }
  }

  actionAdd = output()
  actionSplit = output()
  actionJoin = output()
}
