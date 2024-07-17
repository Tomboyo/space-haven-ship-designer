import React from "react";

import PaintToolPalette from "./PaintToolPalette.jsx";
import LayoutSelector from "./LayoutSelector.jsx";
import Pathing from "./Pathing.jsx";

export default function TabBar({ ecs, layout, setLayout }) {
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
        <button
          className={`tab-header ${openTab === "pathing" ? "active" : ""}`}
          onClick={() => setOpenTab("pathing")}
        >
          Pathing
        </button>
      </div>
      <div className="tab-body">
        {openTab === "paint" ? <PaintToolPalette ecs={ecs} /> : null}
        {openTab === "layout" ? (
          <LayoutSelector ecs={ecs} layout={layout} setLayout={setLayout} />
        ) : null}
        {openTab === "pathing" ? <Pathing ecs={ecs} /> : null}
      </div>
    </div>
  );
}
