import {effect, Injectable, signal, untracked, WritableSignal,} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlState {
  readonly path: WritableSignal<string> = signal(this.readPath());
  readonly hash: WritableSignal<string> = signal(this.readHash());

  constructor() {
    effect(() => {
      window.addEventListener('popstate', this.syncFromLocation);
      window.addEventListener('hashchange', this.syncFromLocation);

      return () => {
        window.removeEventListener('popstate', this.syncFromLocation);
        window.removeEventListener('hashchange', this.syncFromLocation);
      }
    });

    effect(() => {
      const path = this.normalizePath(this.path());
      if (path === this.readPath()) return;
      this.writeUrl(path, untracked(this.hash));
    });

    effect(() => {
      const hash = this.hash();
      if (hash === this.readHash()) return;
      this.writeUrl(untracked(this.path), hash);
    });
  }

  private syncFromLocation = () => {
    const path = this.readPath();
    if (path !== this.path())
      this.path.set(path);

    const hash = this.readHash();
    if (hash !== this.hash())
      this.hash.set(hash);
  };

  private writeUrl(
    path: string,
    hash: string,
  ): void {
    const url = new URL(window.location.href);

    url.pathname = this.normalizePath(path);
    url.hash = this.normalizeHash(hash);
    const next = url.toString();

    if (next === window.location.href)
      return;

    history.replaceState(
      null,
      '',
      next,
    );
  }

  private readPath(): string {
    return decodeURIComponent(
      window.location.pathname.replace(
        /^\/+/,
        '',
      ),
    );
  }

  private readHash(): string {
    return decodeURIComponent(
      window.location.hash.replace(
        /^#/,
        '',
      ),
    );
  }

  private normalizePath(
    path: string,
  ): string {
    return path.trim().replace(/^\//, '');
  }

  private normalizeHash(
    hash: string
  ) {
    return hash.trim().replace(/^#/, '');;
  }
}
