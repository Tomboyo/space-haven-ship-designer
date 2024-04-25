import React from "react";
import ReactDOM from "react-dom/client";

import PaintToolPalette from "./PaintToolPalette.jsx";

export function install({ ecs }) {
  const root = ReactDOM.createRoot(document.querySelector("#paint-tab-body"));
  root.render(<PaintToolPalette ecs={ecs} />);
}
