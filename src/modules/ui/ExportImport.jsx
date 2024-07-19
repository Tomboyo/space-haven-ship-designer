import React from "react";

import { save } from "../save.js";

export default function ExportImport({ ecs }) {
  const ref = React.useRef(null);

  function onExport() {
    ref.current.value = btoa(JSON.stringify(ecs.getSaveData()));
  }

  function onImport() {
    let data = JSON.parse(atob(ref.current.value));
    ecs.loadSaveData(data);
    save(data);
  }

  return (
    <div className="tab-body export-import-tab">
      <div className="buttons">
        <button onClick={() => onExport()}>Export</button>
        <button onClick={() => onImport()}>Import</button>
      </div>
      <textarea ref={ref} placeholder="Ship data goes here."></textarea>
    </div>
  );
}
