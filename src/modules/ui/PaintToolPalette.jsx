import React from "react";

import { modules } from "../component/modules.js";

import { clearSaveData } from "../save.js";

import useToolPalette2 from "./useToolPalette.jsx";

import panTool from "./tool/panTool.js";
import hullTool from "./tool/hullTool.js";
import eraseTool from "./tool/eraseTool.js";
import moduleTool from "./tool/moduleTool.js";

export default function PaintToolPalette({ ecs }) {
  const { PaletteToolButton } = useToolPalette2({
    defaultToolFactory: () => panTool(ecs),
  });
  const [activeShelf, setActiveShelf] = React.useState("System");

  function changeShelf(e) {
    setActiveShelf(e.target.value);
  }

  return (
    <div className="flex-button-row big-gap">
      <div className="flex-button-row do-not-shrink">
        <div className="flex-button-row">
          <PaletteToolButton
            toolName="pan"
            toolFactory={(cancel) => hullTool(ecs, cancel)}
          >
            Paint Hull
          </PaletteToolButton>
          <PaletteToolButton
            toolName="erase"
            toolFactory={(cancel) => eraseTool(ecs, cancel)}
          >
            Erase
          </PaletteToolButton>
          <ClearAll ecs={ecs} />
        </div>
      </div>
      <ModulesCarousel
        ecs={ecs}
        PaletteToolButton={PaletteToolButton}
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

function ModulesCarousel({ PaletteToolButton, ecs, changeShelf, activeShelf }) {
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
          PaletteToolButton={PaletteToolButton}
        />
      </div>
    </div>
  );
}

function CarouselShelf({ ecs, modules, PaletteToolButton }) {
  const tools = modules.map((module) => {
    const toolName = `module ${module.name}`;
    const makeTool = (cancel) => moduleTool(ecs, module, cancel);
    return (
      <PaletteToolButton
        key={toolName}
        toolName={toolName}
        toolFactory={makeTool}
      >
        {module.name}
      </PaletteToolButton>
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
