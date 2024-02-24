export const newModule = ({ category, name }, isGhost, position) => {
  return {
    module: {
      category,
      name,
      isGhost,
    },
    position
  }
}
