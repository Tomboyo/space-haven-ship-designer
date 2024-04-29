/* Using a function so that lookup of canvas element is deferred. This allows the code to run in a test context, where the canvas might not exist when the module is loaded. */
function eventTargets() {
  const canvas = document.querySelector("canvas");
  return new Map([
    ["mousedown", canvas],
    ["mouseup", canvas],
    ["mousemove", canvas],
    ["keydown", window],
  ]);
}

export function from(name, handler) {
  let callbacks = [...eventTargets().keys()]
    .filter((key) => handler[key])
    .reduce((map, key) => {
      map.set(key, (e) => handler[key](e));
      return map;
    }, new Map());

  if (handler["deactivate"]) {
    callbacks.set("deactivate", () => handler.deactivate());
  }

  return {
    name,
    callbacks,
  };
}

export function activate({ callbacks }) {
  eventTargets().forEach((target, eventType) => {
    let callback = callbacks.get(eventType);
    callback && target.addEventListener(eventType, callback);
  });
}

export function deactivate({ callbacks }) {
  eventTargets().forEach((target, eventType) => {
    let callback = callbacks.get(eventType);
    /* Target may not exist depending on how a test harness unmounts DOM nodes. If the target no longer exists, there's no callback to unregister either, so this is fine. */
    callback && target?.removeEventListener(eventType, callback);
  });
  callbacks.get("deactivate")?.();
}
