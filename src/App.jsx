import React from "react";

import EditingTools from "./modules/ui/EditingTools.jsx";
import UnderTheCursorTooltip from "./modules/ui/UnderTheCursorTooltip.jsx";

export default function App({ ecs }) {
  const [layout, setLayout] = React.useState(0);

  return (
    <>
      <EditingTools ecs={ecs} layout={layout} setLayout={setLayout} />
      <UnderTheCursorTooltip ecs={ecs} />
    </>
  );
}
