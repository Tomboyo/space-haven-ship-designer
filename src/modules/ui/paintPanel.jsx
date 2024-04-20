import React from 'react'
import ReactDOM from 'react-dom/client'

import { modules } from '../component/modules.js'

import { clearSaveData } from '../save.js'

import ToolButton from './ToolButton.jsx'
import BrushButton from './brushButton.js'

import paintModuleBrush from './behavior/paintModuleBrush.js'
import panBrush from './behavior/panBrush.js'
import paintHullBrush from './behavior/paintHullBrush.js'
import eraseBrush  from './behavior/eraseBrush.js'

const canvas = document.querySelector('#canvas')
const eraseToggle = document.querySelector('#btn-erase')

export function install({ ecs }) {
  const root = ReactDOM.createRoot(document.querySelector('#paint-tab-body'))
  root.render(<PaintToolPalette ecs={ecs} />)
}

function PaintToolPalette({ ecs }) {
  const [ activeButton, setActiveButton ] = React.useState(null)
  const [ activeTool, setActiveTool ] = React.useState(panBrush(ecs))
  const [ activeShelf, setActiveShelf ] = React.useState('System')

  const cm = categorizedModules()
  const options = ([ ...cm.keys() ])
      .map(category => <option key={category}>{category}</option>)
  const moduleToolButtons = cm.get(activeShelf)
      .map(module => {
        const key = `module ${module.name}`
        const brush = paintModuleBrush(ecs, module, onBrushCancel)
        return (
          <ToolButton
              key={key}
              active={activeButton === key}
              onClick={onClickToolButton(key, brush)}>
            {module.name}
          </ToolButton>
        )
      })

  React.useEffect(() => {
    activeTool.activate()
    return () => {
      activeTool.deactivate()
    }
  }, [ activeTool ])

  function onCategorySelectChange(e) {
    setActiveShelf(e.target.value)
  }

  function onClickToolButton(button, tool) {
    return () => {
      if (activeButton === button) {
        setActiveButton(null)
        setActiveTool(panBrush(ecs))
      } else {
        setActiveButton(button)
        setActiveTool(tool)
      }
    }
  }

  function onBrushCancel() {
    setActiveButton(null)
    setActiveTool(panBrush(ecs))
  }

  return (
    <div className="flex-button-row big-gap">
      <div className="flex-button-row do-not-shrink">
        <ToolButton
            onClick={onClickToolButton('paint-hull', paintHullBrush(ecs, onBrushCancel))}
            active={'paint-hull' === activeButton}>
          Paint Hull
        </ToolButton>
        <ToolButton
            onClick={onClickToolButton('erase', eraseBrush(ecs, onBrushCancel))}
            active={'erase' === activeButton}>
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

