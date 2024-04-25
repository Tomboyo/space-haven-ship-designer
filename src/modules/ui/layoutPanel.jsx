import React from "react";
import ReactDOM from "react-dom/client";

export function install({ ecs }) {
  const root = ReactDOM.createRoot(document.querySelector("#layout-tab-body"));
  root.render(<LayoutPanel ecs={ecs} />);
}

const layouts = [
  { label: "1x1: 26x26", width: 26, height: 26 },
  { label: "2x1: 54x26", width: 54, height: 26 },
  { label: "1x2: 26x54", width: 26, height: 54 },
  { label: "3x1: 82x26", width: 82, height: 26 },
  { label: "1x3: 26x82", width: 26, height: 82 },
  { label: "2x2: 54x54", width: 54, height: 54 },
  { label: "2x3: 54x82", width: 54, height: 82 },
  { label: "3x2: 82x54", width: 82, height: 54 },
];

function LayoutPanel({ ecs }) {
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
