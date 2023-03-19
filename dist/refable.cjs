"use strict";
function t(t, e, r, o) {
  if ("a" === r && !o)
    throw new TypeError("Private accessor was defined without a getter");
  if ("function" == typeof e ? t !== e || !o : !e.has(t))
    throw new TypeError(
      "Cannot read private member from an object whose class did not declare it"
    );
  return "m" === r ? o : "a" === r ? o.call(t) : o ? o.value : e.get(t);
}
function e(t, e, r, o, a) {
  if ("m" === o) throw new TypeError("Private method is not writable");
  if ("a" === o && !a)
    throw new TypeError("Private accessor was defined without a setter");
  if ("function" == typeof e ? t !== e || !a : !e.has(t))
    throw new TypeError(
      "Cannot write private member to an object whose class did not declare it"
    );
  return "a" === o ? a.call(t, r) : a ? (a.value = r) : e.set(t, r), r;
}
var r, o, a, i, n, s, c, l, h, d, f;
(o = new WeakMap()),
  (a = new WeakMap()),
  (i = new WeakMap()),
  (r = new WeakSet()),
  (n = function (e) {
    e.forEach((e) => {
      e.removedNodes.forEach((e) => t(this, r, "m", c).call(this, e)),
        e.addedNodes.forEach((e) => t(this, r, "m", s).call(this, e));
    });
  }),
  (s = function (e) {
    if (e.nodeType === Node.ELEMENT_NODE) {
      const o = e;
      o.hasAttribute("data-controller") && t(this, r, "m", l).call(this, o),
        o
          .querySelectorAll("[data-controller]")
          .forEach((e) => t(this, r, "m", l).call(this, e));
    }
  }),
  (c = function (e) {
    if (e.nodeType === Node.ELEMENT_NODE) {
      const o = e;
      o
        .querySelectorAll("[data-controller]")
        .forEach((e) => t(this, r, "m", h).call(this, e)),
        o.hasAttribute("data-controller") && t(this, r, "m", h).call(this, o);
    }
  }),
  (l = function (e) {
    let r = t(this, a, "f").get(e);
    if (!r) {
      const i = e.getAttribute("data-controller"),
        n = t(this, o, "f").get(i);
      (r = new n(e, this)),
        t(this, a, "f").set(e, r),
        queueMicrotask(() => r.created());
    }
    queueMicrotask(() => r.connected());
  }),
  (h = function (e) {
    const r = t(this, a, "f").get(e);
    queueMicrotask(() => r.disconnected());
  });
(d = new WeakMap()),
  (f = new WeakMap()),
  (exports.Application = class {
    constructor() {
      r.add(this),
        o.set(this, new Map()),
        a.set(this, new WeakMap()),
        i.set(this, void 0),
        e(
          this,
          i,
          new MutationObserver((e) => t(this, r, "m", n).call(this, e)),
          "f"
        );
    }
    register(e, r) {
      t(this, o, "f").set(e, r);
    }
    getController(e) {
      return t(this, a, "f").get(e);
    }
    run() {
      new Promise((t) => {
        "loading" == document.readyState
          ? document.addEventListener("DOMContentLoaded", () => t())
          : t();
      }).then(() => {
        document
          .querySelectorAll("[data-controller]")
          .forEach((e) => t(this, r, "m", l).call(this, e)),
          t(this, i, "f").observe(document, { childList: !0, subtree: !0 });
      });
    }
  }),
  (exports.Controller = class {
    constructor(t, r) {
      d.set(this, void 0),
        f.set(this, void 0),
        e(this, d, t, "f"),
        e(this, f, r, "f");
    }
    get element() {
      return t(this, d, "f");
    }
    get application() {
      return t(this, f, "f");
    }
    getController(e) {
      return t(this, f, "f").getController(e);
    }
    created() {}
    connected() {}
    disconnected() {}
  });
//# sourceMappingURL=refable.cjs.map
