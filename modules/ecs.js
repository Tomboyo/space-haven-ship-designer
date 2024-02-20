export function createEcs() {
  return {
    idSequence: 0,
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
      let entity = { ...components, id: this.idSequence++ }
      this.entities.push(entity)
      return entity
    },

    /* Entity => void */
    removeEntity(e) {
      let index = this.entities.findIndex(x => x.id === e.id)
      this.entities.splice(index, 1)
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
