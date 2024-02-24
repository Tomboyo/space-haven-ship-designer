/*
 * Name: The name of the module, like 'X1 Hyperdrive'.
 * Tiles:
 *   solid: Cannot overlap any other tiles. Represents solid space occupied by
 *          machinery.
 *   wall: Cannot overlap any other tiles. These are otherwise solid tiles that
 *         must intersect the walls of the ship. Used by airlocks and engines,
 *         for example.
 *   striped: May overlap empty tiles from other modules. Represents empty
 *            spaces reserved for workers to stand in and operate the module.
 *   empty: May overlap empty and striped tiles. Modules reserve empty space to
 *   	    allow workers to walk around the module, such as the space around an
 *   	    X1 Hyperdrive.
 *   clearance: Cannot overlap any other tiles. Clearance is empty space
 *              reserved by modules like engines and airlocks.
 *
 *   Each tile kind key maps to an array of rectangles filled with tiles of that
 *   kind. Each rectangle object consists of a width and height and optionally
 *   of an offsetX and an offsetY. If either offset is omitted, 0 is inferred.
 *   If a module does not contain a kind of tile, it can omit the key rather
 *   than map to an empty array. E.g. the X1 Hyperdrive has no 'striped' key.
 */
export const modules = {
  system: {
    'Point Defence Turret': {
      solid: [{width: 2, height: 2}]
    },
    'X1 Hyperdrive': {
      solid: [
	{width: 2, height: 4, offsetX: 2}
      ],
      wall: [
	{width: 2, height: 1, offsetX: 2, offsetY: 4}
      ],
      empty: [
	{width: 1, height: 4, offsetX: 1},
	{width: 1, height: 4, offsetX: 4}
      ],
      clearance: [
	{width: 6, height: 12, offsetY: 5}
      ]
    },
    'Operations Console': {
      solid: [{width: 3, height: 2}],
      striped: [{width: 1, height: 1, offsetX: 1, offsetY: 2}]
    },
    'Navigation Console': {
      solid: [{width: 3, height: 2}],
      striped: [{width: 1, height: 1, offsetX: 1, offsetY: 2}]
    },
    'Hull Stabilizer': {
      solid: [{width: 2, height: 1}],
      striped: [{width: 2, height: 1, offsetY: 1}]
    },
    'X3 System Core': {
      empty: [{width: 1, height: 4}],
      solid: [{width: 2, height: 4, offsetX: 1}]
    },
    'X2 System Core': {
      empty: [{width: 1, height: 3}],
      solid: [{width: 2, height: 3, offsetX: 1}]
    },
    'X1 System Core': {
      empty: [{width: 1, height: 2}],
      solid: [{width: 2, height: 2, offsetX: 1}]
    },
  }
}
