export function createEcs() {
  return {
    isSaveDataModified: false,
    needsToRun: false,
    isDirty: false,
    idSequence: 0,
    resources: new Map([]),
    entities: [],
    systems: [],

    newResource(name, resource) {
      if (this.resources.has(name))
        throw new Error(`Resource ${name} already exists`);
      this.resources.set(name, resource);
      this.needsToRun = true;
      return resource;
    },

    getResource(name) {
      if (this.resources.has(name)) {
        return this.resources.get(name);
      } else {
        throw new Error("ECS does not have resource named " + name);
      }
    },

    updateResource(name, f) {
      if (this.resources.has(name)) {
        this.needsToRun = true;
        return f(this.resources.get(name));
      } else {
        throw new Error(`No such resource ${name}`);
      }
    },

    /* components: { string => obj } => Entity */
    newEntity(components) {
      let entity = { ...components, id: this.idSequence++ };
      this.entities.push(entity);
      this.needsToRun = true;
      this.isSaveDataModified = true;
      return entity;
    },

    updateEntity(entity, f) {
      let e = this.entities.find((x) => x.id === entity.id);
      if (!e) throw new Error("ECS does not have entity with id " + entity.id);
      this.needsToRun = true;
      this.isSaveDataModified = true;
      return f(e);
    },

    entityQuery(resourceSignature, componentSignature, f) {
      let buffer = new CommandBuffer();
      let resources = resourceSignature.map((name) => {
        if (!this.resources.has(name))
          throw new Error(`No such resource ${name}`);
        return this.resources.get(name);
      });
      this.entities
        .filter((e) => this.hasComponentSignature(e, componentSignature))
        .forEach((entity) => f(...resources, entity, buffer));
      buffer.applyCommands(this);
      // If there were any changes, applyCommands sets isDirty via removeEntity.
    },

    /* Entity => void */
    removeEntity(x) {
      let id = typeof x === "object" ? x.id : x;
      let index = this.entities.findIndex((e) => e.id === id);
      this.entities.splice(index, 1);
      this.needsToRun = true;
      this.isSaveDataModified = true;
    },

    removeAllEntities() {
      this.entities = [];
      this.sequenceId = 0;
      this.needsToRun = true;
      this.isSaveDataModified = true;
    },

    /* args: [ [ name: String, resourceSignature: [string], componentSignature: [string], f: function arity resources.length + components.length ] ] => void */
    registerSystems(args) {
      args.forEach(([name, resourceSignature, componentSignature, f]) => {
        this.systems.push({ name, resourceSignature, componentSignature, f });
      });
      this.needsToRun = true;
    },

    run() {
      this.systems.forEach(({ resourceSignature, componentSignature, f }) => {
        let resources = resourceSignature.map((name) =>
          this.resources.get(name),
        );
        let components = this.entities
          .filter((e) => this.hasComponentSignature(e, componentSignature))
          .map((e) => this.entityToComponents(e, componentSignature));
        f(...resources, components);
      });
      this.isDirty = false;
    },

    hasComponentSignature(entity, signature) {
      return signature.every((name) => Object.hasOwn(entity, name));
    },

    entityToComponents(entity, signature) {
      return signature.map((name) => entity[name]);
    },

    getSaveData() {
      this.isSaveDataModified = false;
      return {
        entities: this.entities,
      };
    },

    loadSaveData(obj) {
      this.entities = obj?.entities || [];
      /* Reset ids rather than save/load them so that related bugs can be fixed
       * with a refresh. */
      this.entities.forEach((entity, i) => (entity.id = i));
      this.idSequence = this.entities.length;
    },
  };
}

class CommandBuffer {
  constructor() {
    this.toRemove = [];
  }

  removeEntity(e) {
    this.toRemove.push(e);
  }

  applyCommands(ecs) {
    this.toRemove.forEach((e) => ecs.removeEntity(e));
  }
}
