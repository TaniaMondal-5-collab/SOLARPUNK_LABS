// ASTROBASE: Micro-React Fallback Shim
// Ensures the game runs 100% offline even if CDN is blocked or unavailable

(function() {
  if (typeof window === "undefined" || window.React) {
    return; // Native React already loaded
  }

  console.log("ASTROBASE: Initializing embedded lightweight React engine for offline resilience.");

  let currentComponent = null;
  let hookIndex = 0;
  let rootContainer = null;
  let rootComponent = null;
  let isRenderPending = false;

  function scheduleRender() {
    if (isRenderPending) return;
    isRenderPending = true;
    requestAnimationFrame(() => {
      isRenderPending = false;
      if (rootContainer && rootComponent) {
        renderRoot();
      }
    });
  }

  function createElement(type, props, ...children) {
    props = props || {};
    const flatChildren = children.flat().filter(c => c !== null && c !== undefined && c !== false);
    return {
      type,
      props: {
        ...props,
        children: flatChildren
      }
    };
  }

  const hooksState = new Map();

  function useState(initialValue) {
    const compId = currentComponent;
    const idx = hookIndex++;
    
    if (!hooksState.has(compId)) {
      hooksState.set(compId, []);
    }
    const compHooks = hooksState.get(compId);
    
    if (compHooks[idx] === undefined) {
      compHooks[idx] = typeof initialValue === 'function' ? initialValue() : initialValue;
    }
    
    const setState = (newValue) => {
      const val = typeof newValue === 'function' ? newValue(compHooks[idx]) : newValue;
      if (val !== compHooks[idx]) {
        compHooks[idx] = val;
        scheduleRender();
      }
    };
    
    return [compHooks[idx], setState];
  }

  function useEffect(callback, deps) {
    const compId = currentComponent;
    const idx = hookIndex++;
    if (!hooksState.has(compId)) {
      hooksState.set(compId, []);
    }
    const compHooks = hooksState.get(compId);
    const prev = compHooks[idx];
    const hasChanged = !prev || !deps || deps.some((d, i) => d !== prev.deps[i]);
    
    if (hasChanged) {
      if (prev && typeof prev.cleanup === 'function') {
        try { prev.cleanup(); } catch (e) { console.error(e); }
      }
      setTimeout(() => {
        try {
          const cleanup = callback();
          compHooks[idx] = { deps, cleanup };
        } catch (e) { console.error(e); }
      }, 0);
    }
  }

  function useMemo(factory, deps) {
    const compId = currentComponent;
    const idx = hookIndex++;
    if (!hooksState.has(compId)) {
      hooksState.set(compId, []);
    }
    const compHooks = hooksState.get(compId);
    const prev = compHooks[idx];
    const hasChanged = !prev || !deps || deps.some((d, i) => d !== prev.deps[i]);
    if (hasChanged) {
      const val = factory();
      compHooks[idx] = { val, deps };
      return val;
    }
    return prev.val;
  }

  function useCallback(callback, deps) {
    return useMemo(() => callback, deps);
  }

  function useRef(initialValue) {
    return useMemo(() => ({ current: initialValue }), []);
  }

  // DOM Diffing & Mounting
  function createDomNode(vnode) {
    if (typeof vnode === "string" || typeof vnode === "number") {
      return document.createTextNode(String(vnode));
    }
    if (!vnode || !vnode.type) {
      return document.createTextNode("");
    }
    if (typeof vnode.type === "function") {
      const prevComp = currentComponent;
      const prevIdx = hookIndex;
      currentComponent = vnode.type;
      hookIndex = 0;
      let rendered;
      try {
        rendered = vnode.type(vnode.props);
      } catch (e) {
        console.error("Component render error:", e);
        rendered = createElement("div", { className: "error-card" }, "Component Error");
      }
      currentComponent = prevComp;
      hookIndex = prevIdx;
      return createDomNode(rendered);
    }

    const el = document.createElement(vnode.type);
    const { children, ...attrs } = vnode.props || {};

    for (const [key, val] of Object.entries(attrs)) {
      if (key === "className") {
        el.className = val;
      } else if (key === "dangerouslySetInnerHTML" && val && val.__html) {
        el.innerHTML = val.__html;
      } else if (key.startsWith("on") && typeof val === "function") {
        const eventName = key.slice(2).toLowerCase();
        el.addEventListener(eventName, val);
      } else if (key === "style" && typeof val === "object") {
        Object.assign(el.style, val);
      } else if (typeof val !== "function" && typeof val !== "object") {
        el.setAttribute(key, String(val));
      }
    }

    if (!attrs.dangerouslySetInnerHTML && children) {
      for (const child of children) {
        el.appendChild(createDomNode(child));
      }
    }

    return el;
  }

  function renderRoot() {
    if (!rootContainer || !rootComponent) return;
    const dom = createDomNode(rootComponent);
    rootContainer.innerHTML = "";
    rootContainer.appendChild(dom);
  }

  window.React = {
    createElement,
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef
  };

  window.ReactDOM = {
    createRoot(container) {
      rootContainer = container;
      return {
        render(component) {
          rootComponent = component;
          renderRoot();
        }
      };
    }
  };
})();

