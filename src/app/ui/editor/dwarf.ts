import {Component, input, model, output} from '@angular/core';
import {EdNavestidlo} from './util';
import {EditorAction} from './editor';
import {EditorBar} from './bar';
import {EditorModule} from './module';
import {ActionSection} from '../action/section';

@Component({
  selector: 'app-editor-dwarf',
  imports: [
    EditorBar,
    EditorModule,
    ActionSection
  ],
  template: `
    @let data = structure();

    <div class="container">
    @for (part of data.content; track part.id) {
      @let partIndex = $index;
      @let position = $last && !$first ? "right" : "left";

      <div class="column">

      @for (module of part.content; track module.id) {
        @let moduleIndex = $index;
        <app-editor-bar
          [add]="true"
          (actionAdd)="action.emit(['addModule', partIndex, moduleIndex, true])"
          [position]="position"
        />
        <app-action-section
          primaryIcon="delete"
          primaryColor="R"
          (primaryAction)="action.emit(['removeModule', partIndex, moduleIndex])"
          [position]="position"

          hoverColor="Y"
          (hoverAction)="selected.set(module.id)"
          [forceHover]="module.id === selected()"
        >
          @if (module.kind !== "module-placeholder") {
            <app-editor-module [structure]="module"/>
          } @else {
            <div style="height: var(--unit-height)"></div>
          }
        </app-action-section>
      }
      <app-editor-bar
        [add]="true"
        (actionAdd)="action.emit(['addModule', partIndex, part.content.length, true])"
        [position]="position"
      />
      </div>
    }
    </div>
  `,
  styles: `
    :host {
      --unit-width: calc( var(--calculated-width) / 2);
    }

    .container {
      display: flex;
      align-items: end;
    }

    .column {
      display: inline-block;
    }

  `,
})
export class EditorDwarf {

  structure = input.required<EdNavestidlo>();
  selected = model<string>();
  action = output<EditorAction>();

}
