import React from "react";

import * as util from "../util.js";

export default function UnderTheCursorTooltip({ ecs }) {
  const [hovered, setHovered] = React.useState([]);

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

  return (
    <div className="under-the-cursor-tooltip">
      Under the cursor:
      <ul>
        {hovered.length ? (
          hovered.map((label) => <li key={label}>{label}</li>)
        ) : (
          <li>Nothing.</li>
        )}
      </ul>
    </div>
  );
}

function getHoveredModules(ecs, e) {
  let acc = [];
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
      acc.push(module.name);
    }
  });
  return acc;
}
