var refable = (function (t) {
  "use strict";
  function e(t, e, r, o) {
    if ("a" === r && !o)
      throw new TypeError("Private accessor was defined without a getter");
    if ("function" == typeof e ? t !== e || !o : !e.has(t))
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    return "m" === r ? o : "a" === r ? o.call(t) : o ? o.value : e.get(t);
  }
  function r(t, e, r, o, n) {
    if ("m" === o) throw new TypeError("Private method is not writable");
    if ("a" === o && !n)
      throw new TypeError("Private accessor was defined without a setter");
    if ("function" == typeof e ? t !== e || !n : !e.has(t))
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return "a" === o ? n.call(t, r) : n ? (n.value = r) : e.set(t, r), r;
  }
  var o, n, a, i, s, c, l, h, d, f, u;
  (n = new WeakMap()),
    (a = new WeakMap()),
    (i = new WeakMap()),
    (o = new WeakSet()),
    (s = function (t) {
      t.forEach((t) => {
        t.removedNodes.forEach((t) => e(this, o, "m", l).call(this, t)),
          t.addedNodes.forEach((t) => e(this, o, "m", c).call(this, t));
      });
    }),
    (c = function (t) {
      if (t.nodeType === Node.ELEMENT_NODE) {
        const r = t;
        r.hasAttribute("data-controller") && e(this, o, "m", h).call(this, r),
          r
            .querySelectorAll("[data-controller]")
            .forEach((t) => e(this, o, "m", h).call(this, t));
      }
    }),
    (l = function (t) {
      if (t.nodeType === Node.ELEMENT_NODE) {
        const r = t;
        r
          .querySelectorAll("[data-controller]")
          .forEach((t) => e(this, o, "m", d).call(this, t)),
          r.hasAttribute("data-controller") && e(this, o, "m", d).call(this, r);
      }
    }),
    (h = function (t) {
      let r = e(this, a, "f").get(t);
      if (!r) {
        const o = t.getAttribute("data-controller"),
          i = e(this, n, "f").get(o);
        (r = new i(t, this)),
          e(this, a, "f").set(t, r),
          queueMicrotask(() => r.created());
      }
      queueMicrotask(() => r.connected());
    }),
    (d = function (t) {
      const r = e(this, a, "f").get(t);
      queueMicrotask(() => r.disconnected());
    });
  return (
    (f = new WeakMap()),
    (u = new WeakMap()),
    (t.Application = class {
      constructor() {
        o.add(this),
          n.set(this, new Map()),
          a.set(this, new WeakMap()),
          i.set(this, void 0),
          r(
            this,
            i,
            new MutationObserver((t) => e(this, o, "m", s).call(this, t)),
            "f"
          );
      }
      register(t, r) {
        e(this, n, "f").set(t, r);
      }
      getController(t) {
        return e(this, a, "f").get(t);
      }
      run() {
        new Promise((t) => {
          "loading" == document.readyState
            ? document.addEventListener("DOMContentLoaded", () => t())
            : t();
        }).then(() => {
          document
            .querySelectorAll("[data-controller]")
            .forEach((t) => e(this, o, "m", h).call(this, t)),
            e(this, i, "f").observe(document, { childList: !0, subtree: !0 });
        });
      }
    }),
    (t.Controller = class {
      constructor(t, e) {
        f.set(this, void 0),
          u.set(this, void 0),
          r(this, f, t, "f"),
          r(this, u, e, "f");
      }
      get element() {
        return e(this, f, "f");
      }
      get application() {
        return e(this, u, "f");
      }
      getController(t) {
        return e(this, u, "f").getController(t);
      }
      created() {}
      connected() {}
      disconnected() {}
    }),
    t
  );
})({});
//# sourceMappingURL=refable.js.map
