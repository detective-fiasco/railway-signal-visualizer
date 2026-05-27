import {Component, effect, model, signal} from '@angular/core';
import {Module, navestidlo, Navestidlo, Part, part} from '../../../dsl/types';
import {serialize} from '../../../dsl/serialize';
import {derivedSignal} from '../../../util/derivedSignal';
import {parse} from '../../../dsl/parse';
import {format} from '../../../dsl/format';
import {addIds, EdNavestidlo, generateId, PlaceholderModule, WithIds} from './util';
import {EditorNormal} from './normal';
import {EditorDwarf} from './dwarf';


export type EditorAction =
  [ "addPart", number, boolean] |
  [ "addModule", number, number, boolean ] |
  [ "removeModule", number, number ] |
  [ "joinPart", number ] |
  [ "splitPart", number, number ]
;


@Component({
  selector: 'app-editor',
  imports: [
    EditorNormal,
    EditorDwarf,
  ],
  template: `
    @if (mode() === "dwarf") {
      <app-editor-dwarf
        [structure]="serialized()"
        [(selected)]="selected"
        (action)="handleAction($event)"
      />
    } @else {
      <app-editor-normal
        [structure]="serialized()"
        [(selected)]="selected"
        (action)="handleAction($event)"
      />
    }
  `,
  styles: ``,
})
export class Editor {

  structure = model.required<string>();
  mode = model.required<"normal"|"dwarf">();

  serialized = derivedSignal<string, EdNavestidlo>({
    source: this.structure,
    initialValue: addIds(navestidlo()),
    toDerived: (s: string, d: EdNavestidlo) => {
      const p = parse(s);
      if (p === null) return d;
      if (serialize(p) === serialize(this.dropPlaceholder(d))) return d;
      return addIds(p);
    },
    toSource: (d, s) => serialize(this.dropPlaceholder(d)),
    equalSource: (o, n) => format(o) === n,
    equalDerived: (o, n) => serialize(this.dropPlaceholder(o)) === serialize(this.dropPlaceholder(n))
  });

  selected = signal<string>("");

  constructor() {
    effect(() => {
      this.serialized.update(v=> {
        return this.dropPlaceholderExcept(v, this.selected())
      })
    })
  }

  handleAction(action: EditorAction) {
    switch (action[0]) {
      case 'addPart':
        const m1 = this.createModule(action[2]);
        this.actionAddPart(action[1], m1);
        this.selected.set(m1.id);
        return;
      case 'addModule':
        const m2 = this.createModule(action[3]);
        this.actionAddModule(action[1], action[2], m2);
        this.selected.set(m2.id);
        return;
      case 'removeModule':
        this.actionRemoveModule(action[1], action[2]);
        return;
      case 'joinPart':
        this.actionJoinPart(action[1]);
        return;
      case 'splitPart':
        this.actionSplitPart(action[1], action[2]);
        return;
    }
  }


  private actionRemoveModule(partIndex: number, moduleIndex: number) {
    this.serialized.update(value => {
      let { content: nContent, ...nRest } = value;

      nContent = nContent
        .map((p, i) => {
          if (i !== partIndex) return p;
          let { content: pContent, ...pRest } = p;
          pContent = pContent.filter((_, i) => i !== moduleIndex);
          return { content: pContent, ...pRest };
        })
        .filter((p, i) => {
          if (i !== partIndex) return true;
          return p.content.length > 0;
        });

      return { content: nContent, ...nRest };
    })
  }

  private actionSplitPart(partIndex: number, moduleIndex: number) {
    this.serialized.update(value => {
      let { content: nContent, ...nRest } = value;

      let { content: pContent, ...pRest } = nContent[partIndex];
      nContent = [
        ...nContent.filter((_, i) => i < partIndex),
        {
          content: pContent.filter((_, i) => i < moduleIndex),
          ...pRest,
        },
        {
          content: pContent.filter((_, i) => i >= moduleIndex),
          ...pRest,
          id: generateId()
        },
        ...nContent.filter((_, i) => i > partIndex)
      ];

      return { content: nContent, ...nRest };
    })
  }

  private actionJoinPart(partIndex: number) {
    this.serialized.update(value => {
      let { content: nContent, ...nRest } = value;

      const { content: p1Content, ...p1Rest } = nContent[partIndex-1];
      const { content: p2Content, ...p2Rest } = nContent[partIndex];

      nContent = [
        ...nContent.filter((_, i) => i < partIndex - 1),
        {
          ...p1Rest,
          content: [...p1Content, ...p2Content]
        },
        ...nContent.filter((_, i) => i > partIndex),
      ];

      return { content: nContent, ...nRest };
    })
  }

  private createModule(isBulb: boolean): WithIds<Module|PlaceholderModule> {
    const id = generateId();

    return isBulb ? {
      kind: "module-bulb",
      content: [],
      id: id,
    } : {
      kind: "module-placeholder",
      id: id,
    }
  }

  private actionAddPart(partIndex: number, module: WithIds<Module|PlaceholderModule>) {

    this.serialized.update(value => {
      let {content: nContent, ...nRest} = value;

      nContent = [
        ...nContent.filter((_, i) => i < partIndex),
        {
          kind: "part",
          id: generateId(),
          content: [
            module
          ]
        },
        ...nContent.filter((_, i) => i >= partIndex),
      ]

      return {content: nContent, ...nRest};
    });
  }

  private actionAddModule(partIndex: number, moduleIndex: number, module: WithIds<Module|PlaceholderModule>) {
    this.serialized.update(value => {
      let { content: nContent, ...nRest } = value;
      let { content: pContent, ...pRest } = nContent[partIndex];

      nContent = [
        ...nContent.filter((_, i) => i < partIndex),
        {
          content: [
            ...pContent.filter((_, i) => i < moduleIndex),
            module,
            ...pContent.filter((_, i) => i >= moduleIndex),
          ],
          ...pRest,
        },
        ...nContent.filter((_, i) => i > partIndex),
      ];

      return {content: nContent, ...nRest};
    });
  }

  dropPlaceholder(value: EdNavestidlo): WithIds<Navestidlo> {
    return this.dropPlaceholderExcept(value, null as any) as WithIds<Navestidlo>;
  }

  dropPlaceholderExcept(value: EdNavestidlo, id: string): EdNavestidlo {
    const { content: nContent, ...nRest } = value;

    const nContentFiltered = nContent
      .map(part => {
        const { content: pContent, ...pRest } = part;
        const pContentFiltered = pContent
          .filter(module => module.kind !== "module-placeholder" || module.id === id) as WithIds<Module>[]
        return { content: pContentFiltered, ...pRest };
      })
      .filter(part => part.content.length) as WithIds<Part>[];

    return { content: nContentFiltered, ...nRest };
  }

}
