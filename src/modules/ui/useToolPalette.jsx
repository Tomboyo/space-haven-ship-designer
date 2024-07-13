import React from "react";

import ToolButton from "./ToolButton.jsx";
import * as tool from "./tool/tool.js";

export default function useToolPalette({
  defaultToolName,
  defaultToolFactory,
}) {
  const [currentToolFactory, setCurrentToolFactory] = React.useState({
    name: defaultToolName,
    f: defaultToolFactory,
  });

  const PaletteToolButton = React.useMemo(
    () =>
      function PaletteToolButton({ toolName, toolFactory, children }) {
        function toggleToolFactory() {
          if (toolName === currentToolFactory.name) {
            setCurrentToolFactory({
              name: defaultToolName,
              f: defaultToolFactory,
            });
          } else {
            setCurrentToolFactory({
              name: toolName,
              f: toolFactory,
            });
          }
        }

        return (
          <ToolButton
            active={currentToolFactory.name === toolName}
            onClick={toggleToolFactory}
          >
            {children}
          </ToolButton>
        );
      },
    [
      currentToolFactory,
      setCurrentToolFactory,
      defaultToolFactory,
      defaultToolName,
    ],
  );

  React.useEffect(() => {
    let onCancel = () =>
      setCurrentToolFactory({
        name: defaultToolName,
        f: defaultToolFactory,
      });
    let pickedTool = currentToolFactory.f(onCancel);
    tool.activate(pickedTool);
    return () => tool.deactivate(pickedTool);
  }, [
    currentToolFactory,
    setCurrentToolFactory,
    defaultToolFactory,
    defaultToolName,
  ]);

  return {
    PaletteToolButton,
  };
}
