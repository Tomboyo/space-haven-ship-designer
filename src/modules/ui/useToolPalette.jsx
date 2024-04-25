import React from "react";

import ToolButton from "./ToolButton.jsx";

export default function useToolPalette({ defaultTool }) {
  const [activeTool, setActiveTool] = React.useState(defaultTool);

  const PreparedToolButton = React.useMemo(() => {
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

    return ({ toolName, makeTool, children }) => {
      const tool = {
        name: toolName,
        handler: makeTool(cancelTool),
      };
      return (
        <ToolButton
          onClick={() => toggleTool(tool)}
          active={activeTool.name === tool.name}
        >
          {children}
        </ToolButton>
      );
    };
  }, [activeTool, defaultTool]);

  React.useEffect(() => {
    activeTool.handler.activate();
    return () => activeTool.handler.deactivate();
  }, [activeTool]);

  return {
    ToolButton: PreparedToolButton,
  };
}
