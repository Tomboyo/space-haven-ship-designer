import React from "react";

import ToolButton from "./ToolButton.jsx";
import * as tool from "./tool/tool.js";

export default function useToolPalette({ defaultTool }) {
  const [activeTool, setActiveTool] = React.useState(defaultTool);

  const PaletteToolButton = React.useMemo(
    () =>
      function PaletteToolButton({ makeTool, children }) {
        function toggleTool(tool) {
          if (tool.name === activeTool.name) {
            setActiveTool(defaultTool);
          } else {
            setActiveTool(tool);
          }
        }

        function cancelTool() {
          setActiveTool(defaultTool);
        }

        const tool = makeTool(cancelTool);
        return (
          <ToolButton
            active={activeTool.name === tool.name}
            onClick={() => toggleTool(tool)}
          >
            {children}
          </ToolButton>
        );
      },
    [activeTool, setActiveTool, defaultTool],
  );

  React.useEffect(() => {
    tool.activate(activeTool);
    return () => tool.deactivate(activeTool);
  }, [activeTool]);

  return {
    PaletteToolButton,
  };
}
