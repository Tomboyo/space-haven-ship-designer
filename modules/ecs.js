export function createEcs() {
  return {
    resources: {},
    entities: [],
    systems: [],

    newResource(name, resource) {
      if (this.resources.hasOwnProperty(name))
	throw new Error(`Resource ${name} already exists`)
      this.resources[name] = resource
      return resource
    },

    /* components: { string => obj } => Entity */
    newEntity(components) {
      let entity = { ...components, id: this.entities.lenth }
      this.entities.push(entity)
      return entity
    },

    /* Entity => void */
    removeEntity(e) {
      this.entities.splice(e.id, 1)
    },

    /* args: [ [ name: String, resourceSignature: [string], componentSignature: [string], f: function arity resources.length + components.length ] ] => void */
    registerSystems(args) {
      args.forEach(([ name, resourceSignature, componentSignature, f ]) => {
	this.systems.push({ name, resourceSignature, componentSignature, f })
      })
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
    },
  }
}
