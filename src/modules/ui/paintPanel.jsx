import React from 'react'
import ReactDOM from 'react-dom/client'

import { modules } from '../component/modules.js'

import { clearSaveData } from '../save.js'

import useToolPalette from './useToolPalette.jsx'
import ToolButton from './ToolButton.jsx'

import paintModuleBrush from './behavior/paintModuleBrush.js'
import panBrush from './behavior/panBrush.js'
import paintHullBrush from './behavior/paintHullBrush.js'
import eraseBrush  from './behavior/eraseBrush.js'

export function install({ ecs }) {
  const root = ReactDOM.createRoot(document.querySelector('#paint-tab-body'))
  root.render(<PaintToolPalette ecs={ecs} />)
}

function PaintToolPalette({ ecs }) {
  const palette = useToolPalette({
    defaultTool: { name: 'pan', handler: panBrush(ecs) }
  })
  const { activeTool, toggleTool, cancelTool } = palette
  const [ activeShelf, setActiveShelf ] = React.useState('System')

  const cm = categorizedModules()
  const paintTool = { name: 'paint', handler: paintHullBrush(ecs, cancelTool) }
  const eraseTool = { name: 'erase', handler: eraseBrush(ecs, cancelTool) }
  
  function onCategorySelectChange(e) {
    setActiveShelf(e.target.value)
  }

  return (
    <div className="flex-button-row big-gap">
      <div className="flex-button-row do-not-shrink">
        <ToolButton
            onClick={() => toggleTool(paintTool)}
            active={activeTool.name === paintTool.name}>
          Paint Hull
        </ToolButton>
        <ToolButton
            onClick={() => toggleTool(eraseTool)}
            active={activeTool.name === eraseTool.name}>
          Erase
        </ToolButton>
        <ClearAll ecs={ecs}/>
        <CarouselSelect onChange={onCategorySelectChange} modulesMap={cm} />
      </div>
      <div className='modules-carousel'>
        <CarouselShelf
          ecs={ecs}
          modules={cm.get(activeShelf)}
          palette={palette} />
      </div>
    </div>
  )
}

function ClearAll({ ecs }) {
  return (
    <button id="btn-clear-all" onClick={() => clearSaveData(ecs)}>Clear All</button>
  )
}

function CarouselSelect({ modulesMap, onChange }) {
  const options = ([ ...modulesMap.keys() ])
      .map(category => <option key={category}>{category}</option>)
  return <select onChange={onChange}>{ options }</select>
}

function CarouselShelf({ ecs, modules, palette }) {
  const { activeTool, toggleTool, cancelTool } = palette
  const tools = modules
      .map(module => {
        const tool = {
          name: `module ${module.name}`,
          handler: paintModuleBrush(ecs, module, cancelTool)
        }

        return (
          <ToolButton
              key={tool.name}
              active={ activeTool.name === tool.name }
              onClick={() => toggleTool(tool)}>
            {module.name}
          </ToolButton>
        )
      })

  return (
    <div className={`flex-button-row carousel-shelf`}>
      {tools}
    </div>
  )
}

function categorizedModules() {
  return modules
    .reduce(
      (acc, module) => {
        if (!acc.get(module.category)) {
          acc.set(module.category, [])
        }
        acc.get(module.category).push(module)
        return acc
      },
      new Map())
}

