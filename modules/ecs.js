export function createEcs() {
  return {
    isDirty: false,
    idSequence: 0,
    resources: {},
    entities: [],
    systems: [],

    newResource(name, resource) {
      if (this.resources.hasOwnProperty(name))
	throw new Error(`Resource ${name} already exists`)
      this.resources[name] = resource
      this.isDirty = true
      return resource
    },

    getResource(name) {
      if (this.resources.hasOwnProperty(name)) {
	return this.resources[name]
      } else {
	throw new Error('ECS does not have resource named ' + name)
      }
    },

    updateResource(name, f) {
      if (this.resources.hasOwnProperty(name)) {
	this.isDirty = true
	return f(this.resources[name])
      } else {
	throw new Error('ECS does not have resource named ' + name)
      }
    },

    /* components: { string => obj } => Entity */
    newEntity(components) {
      let entity = { ...components, id: this.idSequence++ }
      this.entities.push(entity)
      this.isDirty = true
      return entity
    },

    updateEntity(entity, f) {
      let e = this.entities.find(x => x.id === entity.id)
      if (!e)
	throw new Error('ECS does not have entity with id ' + entity.id)
      this.isDirty = true
      return f(e)
    },

    /* Entity => void */
    removeEntity(e) {
      let index = this.entities.findIndex(x => x.id === e.id)
      this.entities.splice(index, 1)
      this.isDirty = true
    },

    /* args: [ [ name: String, resourceSignature: [string], componentSignature: [string], f: function arity resources.length + components.length ] ] => void */
    registerSystems(args) {
      args.forEach(([ name, resourceSignature, componentSignature, f ]) => {
	this.systems.push({ name, resourceSignature, componentSignature, f })
      })
      this.isDirty = true
    },

    run() {
      this.systems.forEach(({ name, resourceSignature, componentSignature, f }) => {
	let resources = resourceSignature.map(name => this.resources[name])
	let components = this.entities
	  .filter(e => componentSignature.every(
	      name => e.hasOwnProperty(name)))
	  .map(e => componentSignature.map(
	      name => e[name]))
	f(...resources, components)
      })
      this.isDirty = false
    },
  }
}
