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
 *   of an offsetX and an offsetY. If a module does not contain a kind of tile,
 *   it can omit the key rather than map to an empty array. E.g. the X1
 *   Hyperdrive has no 'striped' key.
 */
export const modules = [
  {
    category: 'System',
    name: 'Point Defence Turret',
    boundingRect: { width: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 2, offsetX: 0, offsetY: 0}]
    }
  },
  {
    category: 'System',
    name: 'X1 Hyperdrive',
    boundingRect: { width: 6, height: 17},
    tiles: {
      solid: [
	{width: 2, height: 4, offsetX: 2, offsetY: 0}
      ],
      wall: [
	{width: 2, height: 1, offsetX: 2, offsetY: 4}
      ],
      empty: [
	{width: 1, height: 4, offsetX: 1, offsetY: 0},
	{width: 1, height: 4, offsetX: 4, offsetY: 0}
      ],
      clearance: [
	{width: 6, height: 12, offsetX: 0, offsetY: 5}
      ]
    }
  },
  {
    category: 'System',
    name: 'Operations Console',
    boundingRect: {width: 3, height: 3},
    tiles: {
      solid: [{width: 3, height: 2, offsetX: 0, offsetY: 0}],
      striped: [{width: 1, height: 1, offsetX: 1, offsetY: 2}]
    }
  },
  {
    category: 'System',
    name: 'Navigation Console',
    boundingRect: {width: 3, height: 3},
    tiles: {
      solid: [{width: 3, height: 2, offsetX: 0, offsetY: 0}],
      striped: [{width: 1, height: 1, offsetX: 1, offsetY: 2}]
    }
  },
  {
    category: 'System',
    name: 'Hull Stabilizer',
    boundingRect: {width: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 1, offsetX: 0, offsetY: 0}],
      striped: [{width: 2, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'System',
    name: 'X3 System Core',
    boundingRect: { width: 3, height: 4},
    tiles: {
      empty: [{width: 1, height: 4, offsetX: 0, offsetY: 0}],
      solid: [{width: 2, height: 4, offsetY: 0, offsetX: 1}]
    }
  },
  {
    category: 'System',
    name: 'X2 System Core',
    boundingRect: { width: 3, height: 3},
    tiles: {
      empty: [{width: 1, height: 3, offsetX: 0, offsetY: 0}],
      solid: [{width: 2, height: 3, offsetX: 1, offsetY: 0}]
    }
  },
  {
    category: 'System',
    name: 'X1 System Core',
    boundingRect: { width: 3, height: 2},
    tiles: {
      empty: [{width: 1, height: 2, offsetX: 0, offsetY: 0}],
      solid: [{width: 2, height: 2, offsetX: 1, offsetY: 0}]
    }
  },
]

