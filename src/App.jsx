import React from "react";

import EditingTools from "./modules/ui/EditingTools.jsx";
import UnderTheCursorTooltip from "./modules/ui/UnderTheCursorTooltip.jsx";

import layouts from "./modules/ui/layouts.js";

export default function App({ ecs }) {
  const [layout, setLayout] = React.useState(0);

  React.useEffect(() => {
    ecs.updateResource("grid", (grid) => {
      grid.w = layouts[layout].width;
      grid.h = layouts[layout].height;
    });
  }, [ecs, layout]);

  return (
    <>
      <EditingTools ecs={ecs} layout={layout} setLayout={setLayout} />
      <UnderTheCursorTooltip ecs={ecs} />
    </>
  );
}
