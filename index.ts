export type Class<T> = new (...args: any[]) => T;

export class Application {
    #ctors = new Map<string, Class<Controller>>();
    #controllers = new WeakMap<Element, Controller>();
    #observer: MutationObserver;

    constructor() {
        this.#observer = new MutationObserver((mutations) =>
            this.#mutated(mutations)
        );
    }

    #mutated(mutations: MutationRecord[]) {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => this.#removeNode(node));
            mutation.addedNodes.forEach((node) => this.#addNode(node));
        });
    }

    #addNode(node: Node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;

            if (el.hasAttribute("data-controller")) {
                this.#addController(el);
            }

            el.querySelectorAll("[data-controller]").forEach((el) =>
                this.#addController(el)
            );
        }
    }

    #removeNode(node: Node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;

            el.querySelectorAll("[data-controller]").forEach((el) =>
                this.#removeController(el)
            );

            if (el.hasAttribute("data-controller")) {
                this.#removeController(el);
            }
        }
    }

    #addController(el: Element) {
        let controller = this.#controllers.get(el);

        if (!controller) {
            const id = el.getAttribute("data-controller");
            const ctor = this.#ctors.get(id);
            controller = new ctor(el, this);

            this.#controllers.set(el, controller);

            queueMicrotask(() => controller.created());
        }

        queueMicrotask(() => controller.connected());
    }

    #removeController(el: Element) {
        const controller = this.#controllers.get(el);

        queueMicrotask(() => controller.disconnected());
    }

    register(id: string, ctor: Class<Controller>) {
        this.#ctors.set(id, ctor);
    }

    getController<T extends Controller>(el: Element) {
        return this.#controllers.get(el) as T;
    }

    run() {
        domReady().then(() => {
            document
                .querySelectorAll("[data-controller]")
                .forEach((el) => this.#addController(el));

            this.#observer.observe(document, {
                childList: true,
                subtree: true,
            });
        });
    }
}

export class Controller<T extends Element = Element> {
    #element: T;
    #application: Application;

    constructor(element: T, application: Application) {
        this.#element = element;
        this.#application = application;
    }

    get element() {
        return this.#element;
    }

    get application() {
        return this.#application;
    }

    getController<T extends Controller>(el: Element) {
        return this.#application.getController<T>(el);
    }

    created() {}
    connected() {}
    disconnected() {}
}

function domReady() {
    return new Promise<void>((resolve) => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", () => resolve());
        } else {
            resolve();
        }
    });
}
