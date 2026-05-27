import {effect, signal, untracked, WritableSignal} from '@angular/core';

type UpdateEqualityFn<T> = (oldValue: T, newValue: T) => boolean;

export type CreateDerivedSignalOptions<S, D> = {
  source: WritableSignal<S>;
  toSource: (newDerived: D, previousSource: S) => S;
  equalSource?: UpdateEqualityFn<S>;
  equalDerived?: UpdateEqualityFn<D>;
} & ({
  toDerived: (newSource: S, previousDerived?: D) => D;
} | {
  initialValue: D,
  toDerived: (newSource: S, previousDerived: D) => D;
})

export function derivedSignal<S, D>(
  options: CreateDerivedSignalOptions<S, D>
): WritableSignal<D> {

  const {
    source,
    toDerived,
    toSource,
    equalSource = Object.is,
    equalDerived = Object.is,
  } = options;

  const derived = signal(
    "initialValue" in options ? options.initialValue : options.toDerived(source())
  );

  let syncing = false;
  effect(() => {
    const oldDerived = untracked(derived);
    const newDerived = toDerived(source(), oldDerived);

    if (equalDerived(oldDerived, newDerived)) return;

    syncing = true;
    derived.set(newDerived);
    syncing = false;
  });

  effect(() => {
    if (syncing) return;

    const oldSource = untracked(source);
    const newSource = toSource(derived(), oldSource);

    if (equalSource(oldSource, newSource)) return;

    source.set(newSource);
  });

  return derived;
}
