import React from "react";

import layouts from "./layouts.js";

export default function LayoutSelector({ ecs }) {
  const options = layouts.map(({ label }, i) => (
    <option key={label} value={i}>
      {label}
    </option>
  ));

  function onChange(e) {
    const { width, height } = layouts[e.target.value];
    updateGrid(ecs, width, height);
  }

  React.useEffect(() => {
    updateGrid(ecs, layouts[0].width, layouts[0].height);
  }, [ecs]);

  return (
    <div id="layout-tab-flex-container">
      <label htmlFor="layout-select">Select layout:</label>
      <select id="layout-select" onChange={onChange}>
        {options}
      </select>
    </div>
  );
}

function updateGrid(ecs, width, height) {
  ecs.updateResource("grid", (grid) => {
    grid.w = width;
    grid.h = height;
  });
}
