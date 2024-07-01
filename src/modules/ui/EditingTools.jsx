import React from "react";

import PaintToolPalette from "./PaintToolPalette.jsx";
import LayoutSelector from "./LayoutSelector.jsx";

export default function EditingTools({ ecs, layout, setLayout }) {
  const [openTab, setOpenTab] = React.useState("paint");

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab-header ${openTab === "paint" ? "active" : ""}`}
          onClick={() => setOpenTab("paint")}
        >
          Paint
        </button>
        <button
          className={`tab-header ${openTab === "layout" ? "active" : ""}`}
          onClick={() => setOpenTab("layout")}
        >
          Layout
        </button>
      </div>
      <div className="tab-body">
        {openTab === "paint" ? (
          <PaintToolPalette ecs={ecs} />
        ) : (
          <LayoutSelector ecs={ecs} layout={layout} setLayout={setLayout} />
        )}
      </div>
    </div>
  );
}
