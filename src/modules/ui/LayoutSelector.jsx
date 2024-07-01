import React from "react";

import layouts from "./layouts.js";

export default function LayoutSelector({ ecs, layout, setLayout }) {
  const options = layouts.map(({ label }, i) => (
    <option key={label} value={i}>
      {label}
    </option>
  ));

  function onChange(e) {
    setLayout(e.target.value);
  }

  React.useEffect(() => {
    let { width, height } = layouts[layout];
    updateGrid(ecs, width, height);
  }, [ecs, layout]);

  return (
    <div className="layout-tab-flex-container">
      <label>
        Select layout:
        <select id="layout-select" onChange={onChange} value={layout}>
          {options}
        </select>
      </label>
    </div>
  );
}

function updateGrid(ecs, width, height) {
  ecs.updateResource("grid", (grid) => {
    grid.w = width;
    grid.h = height;
  });
}
