import React from 'react'

export default function useToolPalette({ defaultTool }) {
  const [ activeTool, setActiveTool ] = React.useState(defaultTool)

  React.useEffect(() => {
    activeTool.handler.activate()
    return () => activeTool.handler.deactivate()
  }, [ activeTool ])

  function toggleTool(tool) {
    if (tool.name === activeTool.name) {
      setActiveTool(defaultTool)
    } else {
      setActiveTool(tool)
    }
  }

  function cancelTool() {
    setActiveTool(defaultTool)
  }

  return {
    activeTool,
    toggleTool,
    cancelTool
  }
}
