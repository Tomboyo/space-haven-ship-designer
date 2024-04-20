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
  const { activeTool, toggleTool, cancelTool } = useToolPalette({
    defaultTool: { name: 'pan', handler: panBrush(ecs) }
  })
  const [ activeShelf, setActiveShelf ] = React.useState('System')

  const cm = categorizedModules()
  const options = ([ ...cm.keys() ])
      .map(category => <option key={category}>{category}</option>)
  const moduleToolButtons = cm.get(activeShelf)
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

  function onCategorySelectChange(e) {
    setActiveShelf(e.target.value)
  }

  const paintTool = { name: 'paint', handler: paintHullBrush(ecs, cancelTool) }
  const eraseTool = { name: 'erase', handler: eraseBrush(ecs, cancelTool) }

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
        <select onChange={onCategorySelectChange}>
          { options }
        </select>
      </div>
      <div className='modules-carousel'>
        <div className='flex-button-row carousel-shelf'>
          { moduleToolButtons }
        </div>
      </div>
    </div>
  )
}

function ClearAll({ ecs }) {
  return (
    <button id="btn-clear-all" onClick={() => clearSaveData(ecs)}>Clear All</button>
  )
}

function CarouselShelf({ active, children }) {
  return (
    <div className={`flex-button-row carousel-shelf`}>
      {children}
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

