import React from "react";

import useToolPalette from "./useToolPalette.jsx";
import panTool from "./tool/panTool.js";
import pathTool from "./tool/pathTool.js";

export default function Pathing({ ecs }) {
  const toolTipRef = React.useRef(null);
  const { PaletteToolButton } = useToolPalette({
    defaultToolName: "pan",
    defaultToolFactory: () => panTool(ecs),
  });
  const hideToolTip = () => onPathChange(null, null);

  function onPathChange(e, path) {
    if (path) {
      toolTipRef.current.style.display = null;
      toolTipRef.current.style.top = `${e.clientY}px`;
      toolTipRef.current.style.left = `${e.clientX}px`;
      toolTipRef.current.textContent = path.length;
    } else {
      toolTipRef.current.style.display = "none";
      toolTipRef.current.textContent = "";
    }
  }

  return (
    <div className="tab-body">
      <PaletteToolButton
        toolName="path"
        toolFactory={(onCancel) =>
          pathTool(
            ecs,
            () => {
              hideToolTip();
              onCancel();
            },
            onPathChange,
          )
        }
      >
        Measure path
      </PaletteToolButton>
      <p ref={toolTipRef} className="mouse-tool-tip"></p>
    </div>
  );
}
