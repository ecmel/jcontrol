export type Class<T> = new (...args: any[]) => T;

export class Application {
  private ctors = new Map<string, Class<Controller>>();
  private controllers = new WeakMap<Element, Controller>();
  private observer: MutationObserver;

  constructor() {
    this.observer = new MutationObserver((mutations) =>
      this.mutated(mutations),
    );
  }

  private mutated(mutations: MutationRecord[]) {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => this.removeNode(node));
      mutation.addedNodes.forEach((node) => this.addNode(node));
    });
  }

  private addNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      if (el.hasAttribute("data-controller")) {
        this.addController(el);
      }

      el.querySelectorAll("[data-controller]").forEach((el) =>
        this.addController(el),
      );
    }
  }

  private removeNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;

      el.querySelectorAll("[data-controller]").forEach((el) =>
        this.removeController(el),
      );

      if (el.hasAttribute("data-controller")) {
        this.removeController(el);
      }
    }
  }

  private addController(el: Element) {
    let controller = this.controllers.get(el);

    if (!controller) {
      const id = el.getAttribute("data-controller");
      const ctor = this.ctors.get(id);
      controller = new ctor(el, this);

      this.controllers.set(el, controller);

      queueMicrotask(() => controller.created());
    }

    queueMicrotask(() => controller.connected());
  }

  private removeController(el: Element) {
    const controller = this.controllers.get(el);

    queueMicrotask(() => controller.disconnected());
  }

  register(id: string, ctor: Class<Controller>) {
    this.ctors.set(id, ctor);
  }

  getController<T extends Controller>(el: Element): T {
    return this.controllers.get(el) as T;
  }

  ready(resolve: Function) {
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve());
    } else {
      resolve();
    }
  }

  run() {
    this.ready(() => {
      document
        .querySelectorAll("[data-controller]")
        .forEach((el) => this.addController(el));

      this.observer.observe(document, {
        childList: true,
        subtree: true,
      });
    });
  }
}

export class Controller<T extends Element = Element> {
  private _element: T;
  private _application: Application;

  constructor(element: T, application: Application) {
    this._element = element;
    this._application = application;
  }

  get element() {
    return this._element;
  }

  protected getApplication<T extends Application>(): T {
    return this._application as T;
  }

  protected getController<T extends Controller>(el: Element): T {
    return this._application.getController<T>(el);
  }

  created() {}
  connected() {}
  disconnected() {}
}
