import {Component, input, model, output} from '@angular/core';
import {EdNavestidlo} from './util';
import {EditorAction} from './editor';
import {EditorBar} from './bar';
import {Edge} from '../../visualization/edge';
import {EditorModule} from './module';
import {ActionSection} from '../action/section';

@Component({
  selector: 'app-editor-normal',
  imports: [
    EditorBar,
    Edge,
    EditorModule,
    ActionSection
  ],
  template: `
    @let data = structure();
    @for (part of data.content; track part.id) {
      @let partIndex = $index;

      <app-editor-bar
        [rounded]="true"
        [add]="(part.content.length > 1 || part.content[0]?.kind !== 'module-placeholder') && (partIndex === 0 || data.content[partIndex - 1].content.length > 1 || data.content[partIndex - 1].content[0]?.kind !== 'module-placeholder')"
        (actionAdd)="action.emit(['addPart', partIndex, false])"
        [join]="!$first"
        (actionJoin)="action.emit(['joinPart', partIndex])"
      />

      <div style="margin-bottom: 25px"></div> <!-- TODO -->

      <app-edge type="top"/>
      @for (module of part.content; track module.id) {
        @let moduleIndex = $index;
        <app-editor-bar
          [add]="module.kind !== 'module-placeholder' && ($first || part.content[moduleIndex - 1].kind !== 'module-placeholder')"
          (actionAdd)="action.emit(['addModule', partIndex, moduleIndex, false])"
          [split]="!$first"
          (actionSplit)="action.emit(['splitPart', partIndex, moduleIndex])"
        />
        <app-action-section
          primaryIcon="delete"
          primaryColor="R"
          (primaryAction)="action.emit(['removeModule', partIndex, moduleIndex])"

          hoverColor="Y"
          (hoverAction)="selected.set(module.id)"
          [forceHover]="module.id === selected()"
        >
          @if (module.kind !== "module-placeholder") {
            <app-editor-module [structure]="module"/>
          } @else {
            <div style="height: var(--unit-height)"></div> <!-- TODO -->
          }
        </app-action-section>
      }
      <app-editor-bar
        [add]="part.content.length === 0 || part.content[part.content.length - 1].kind !== 'module-placeholder'"
        (actionAdd)="action.emit(['addModule', partIndex, part.content.length, false])"
      />
      <app-edge type="bottom"/>

      <div style="margin-bottom: 25px"></div> <!-- TODO -->
    }
    <app-editor-bar
      [rounded]="true"
      [add]="data.content.length === 0 || data.content[data.content.length - 1].content.length > 1 || data.content[data.content.length - 1].content[0]?.kind !== 'module-placeholder'"
      (actionAdd)="action.emit(['addPart', data.content.length, false])"
    />
  `,
  styles: `
    :host {
      --unit-width: var(--calculated-width);
    }
  `,
})
export class EditorNormal {

  structure = input.required<EdNavestidlo>();
  action = output<EditorAction>();

  selected = model<string>();

}
