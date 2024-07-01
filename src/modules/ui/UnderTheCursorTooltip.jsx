import React from "react";

import * as util from "../util.js";

export default function UnderTheCursorTooltip({ ecs }) {
  const [hovered, setHovered] = React.useState(new Map());

  React.useEffect(() => {
    const canvas = document.querySelector("#canvas");
    const listener = (e) => {
      let h = getHoveredModules(ecs, e);
      if (h !== hovered) {
        setHovered(h);
      }
    };
    canvas.addEventListener("mousemove", listener);
    return () => canvas.removeEventListener("mousemove", listener);
  }, [hovered, ecs]);

  const content =
    hovered.size > 0 ? (
      [...hovered.entries()].map(([k, v]) => {
        const count = v > 1 ? ` (${v})` : "";
        return (
          <li key={k}>
            {k}
            {count}
          </li>
        );
      })
    ) : (
      <li>Nothing.</li>
    );
  return (
    <div className="under-the-cursor-tooltip">
      Under the cursor:
      <ul>{content}</ul>
    </div>
  );
}

function getHoveredModules(ecs, e) {
  let acc = new Map();
  ecs.entityQuery([], ["module"], ({ module, position: { x, y } }) => {
    if (module.isGhost) {
      return;
    }

    let { width, height } = module.boundingRect;
    if (
      util.rectContainsPoint(
        { x, y, width, height },
        util.getTileCoordinates(e, ecs),
      )
    ) {
      acc.set(module.name, (acc.get(module.name) || 0) + 1);
    }
  });
  return acc;
}
