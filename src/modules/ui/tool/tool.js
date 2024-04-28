const canvas = document.querySelector("canvas");
const eventTargets = new Map([
  ["mousedown", canvas],
  ["mouseup", canvas],
  ["mousemove", canvas],
  ["keydown", window],
]);

export function from(name, handler) {
  let callbacks = [...eventTargets.keys()]
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
  eventTargets.forEach((target, eventType) => {
    let callback = callbacks.get(eventType);
    callback && target.addEventListener(eventType, callback);
  });
}

export function deactivate({ callbacks }) {
  eventTargets.forEach((target, eventType) => {
    let callback = callbacks.get(eventType);
    callback && target.removeEventListener(eventType, callback);
  });
  callbacks.get("deactivate")?.();
}
