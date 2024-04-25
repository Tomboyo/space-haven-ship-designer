import React from "react";

import { modules } from "../component/modules.js";

import { clearSaveData } from "../save.js";

import useToolPalette from "./useToolPalette.jsx";

import paintModuleBrush from "./behavior/paintModuleBrush.js";
import panBrush from "./behavior/panBrush.js";
import paintHullBrush from "./behavior/paintHullBrush.js";
import eraseBrush from "./behavior/eraseBrush.js";

export default function PaintToolPalette({ ecs }) {
  const { ToolButton } = useToolPalette({
    defaultTool: { name: "pan", handler: panBrush(ecs) },
  });
  const [activeShelf, setActiveShelf] = React.useState("System");

  function changeShelf(e) {
    setActiveShelf(e.target.value);
  }

  return (
    <div className="flex-button-row big-gap">
      <div className="flex-button-row do-not-shrink">
        <div className="flex-button-row">
          <ToolButton
            toolName="paint"
            makeTool={(cancel) => paintHullBrush(ecs, cancel)}
          >
            Paint Hull
          </ToolButton>
          <ToolButton
            toolName="erase"
            makeTool={(cancel) => eraseBrush(ecs, cancel)}
          >
            Erase
          </ToolButton>
          <ClearAll ecs={ecs} />
        </div>
      </div>
      <ModulesCarousel
        ecs={ecs}
        ToolButton={ToolButton}
        changeShelf={changeShelf}
        activeShelf={activeShelf}
      />
    </div>
  );
}

function ClearAll({ ecs }) {
  return (
    <button id="btn-clear-all" onClick={() => clearSaveData(ecs)}>
      Clear All
    </button>
  );
}

function ModulesCarousel({ ToolButton, ecs, changeShelf, activeShelf }) {
  const cm = categorizedModules();

  const options = [...cm.keys()].map((category) => (
    <option key={category}>{category}</option>
  ));

  return (
    <div className="flex-button-row">
      <select onChange={changeShelf}>{options}</select>
      <div className="modules-carousel">
        <CarouselShelf
          ecs={ecs}
          modules={cm.get(activeShelf)}
          ToolButton={ToolButton}
        />
      </div>
    </div>
  );
}

function CarouselShelf({ ecs, modules, ToolButton }) {
  const tools = modules.map((module) => {
    const toolName = `module ${module.name}`;
    const makeTool = (cancel) => paintModuleBrush(ecs, module, cancel);
    return (
      <ToolButton key={toolName} toolName={toolName} makeTool={makeTool}>
        {module.name}
      </ToolButton>
    );
  });

  return <div className={`flex-button-row carousel-shelf`}>{tools}</div>;
}

function categorizedModules() {
  return modules.reduce((acc, module) => {
    if (!acc.get(module.category)) {
      acc.set(module.category, []);
    }
    acc.get(module.category).push(module);
    return acc;
  }, new Map());
}
