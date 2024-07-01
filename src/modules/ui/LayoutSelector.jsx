import React from "react";

import useToolPalette from "./useToolPalette.jsx";
import layouts from "./layouts.js";

import panTool from "./tool/panTool.js";

export default function LayoutSelector({ ecs, layout, setLayout }) {
  useToolPalette({ defaultTool: panTool(ecs) });
  const options = layouts.map(({ label }, i) => (
    <option key={label} value={i}>
      {label}
    </option>
  ));

  function onChange(e) {
    setLayout(e.target.value);
  }

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
