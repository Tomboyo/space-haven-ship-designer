export function save(data) {
  localStorage.setItem("ecs", JSON.stringify(data));
}

export function load(ecs) {
  ecs.loadSaveData(JSON.parse(localStorage.getItem("ecs")));
}

export function clearSaveData(ecs) {
  if (!confirm("This will delete you ship and saved data. Are you sure?"))
    return;

  ecs.removeAllEntities();
  localStorage.removeItem("ecs");
  ecs.updateResource("tiles", (tiles) => tiles.splice(0));
  ecs.run();
}
