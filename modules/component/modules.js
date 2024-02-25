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
  {
    category: 'Airlock',
    name: 'Shuttle Hanger',
    boundingRect: {width: 7, height: 6},
    tiles: {
      empty: [
	{width: 5, height: 1, offsetX: 1, offsetY: 0},
	{width: 4, height: 1, offsetX: 1, offsetY: 5},
	{width: 1, height: 6, offsetX: 0, offsetY: 0},
	{width: 1, height: 6, offsetX: 6, offsetY: 0},
      ],
      solid: [{width: 5, height: 4, offsetX: 1, offsetY: 1}],
      striped: [{width: 1, height: 1, offsetX: 5, offsetY: 5}]
    }
  },
  {
    category: 'Airlock',
    name: 'Pod Hangler',
    boundingRect: {width: 3, height: 4},
    tiles: {
      solid: [{width: 3, height: 3, offsetX: 0, offsetY: 0}],
      empty: [{width: 2, height: 1, offsetX: 0, offsetY: 3}],
      striped: [{width: 1, height: 1, offsetX: 2, offsetY: 3}]
    }
  },
  {
    category: 'Airlock',
    name: 'X1 Airlock',
    boundingRect: {width: 11, height: 7},
    tiles: {
      clearance: [{width: 7, height: 7, offsetX: 0, offsetY: 0}],
      wall: [{width: 1, height: 1, offsetX: 7, offsetY: 3}],
      solid: [
	{width: 1, height: 3, offsetX: 8, offsetY: 2},
	{width: 1, height: 1, offsetX: 9, offsetY: 2},
	{width: 1, height: 1, offsetX: 9, offsetY: 4}
      ],
      striped: [
	{width: 1, height: 1, offsetX: 9, offsetY: 3},
	{width: 1, height: 3, offsetX: 10, offsetY: 2}
      ],
    }
  },
  {
    category: 'Airlock',
    name: 'Space Suit Locker',
    boundingRect: {width: 1, height: 3},
    tiles: {
      empty: [{width: 1, height: 1, offsetX: 0, offsetY: 0}],
      solid: [{width: 1, height: 2, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Storage',
    name: 'Cargo Port',
    boundingRect: {width: 11, height: 7},
    tiles: {
      clearance: [
	// Note: this overlaps with the forks. This may or may not be "correct."
	{width: 8, height: 7, offsetX: 0, offsetY: 0},
      ],
      striped: [
	{width: 6, height: 1, offsetX: 2, offsetY: 1},
	{width: 6, height: 1, offsetX: 2, offsetY: 5},
      ],
      wall: [{ width: 1, height: 5, offsetX: 8, offsetY: 1 }],
      solid: [{ width: 1, height: 5, offsetX: 9, offsetY: 1 }],
      empty: [{ width: 1, height: 5, offsetX: 10, offsetY: 1 }],
    }
  },
  {
    category: 'Storage',
    name: 'Body Storage',
    boundingRect: {width: 2, height: 3},
    tiles: {
      solid: [{width: 2, height: 2, offsetX: 0, offsetY: 0}],
      empty: [{width: 2, height: 1, offsetX: 0, offsetY: 2}]
    }
  },
  {
    category: 'Storage',
    name: 'Large Storage',
    boundingRect: {width: 3, height: 3},
    tiles: {
      solid: [{width: 3, height: 2, offsetX: 0, offsetY: 0}],
      striped: [{width: 1, height: 1, offsetX: 1, offsetY: 2}]
    }
  },
  {
    category: 'Storage',
    name: 'Small Storage',
    boundingRect: {width: 1, height: 3},
    tiles: {
      solid: [{width: 1, height: 2, offsetX: 0, offsetY: 0}],
      striped: [{width: 1, height: 1, offsetX: 0, offsetY: 2}]
    }
  },
  {
    category: 'Food',
    name: 'Kitchen',
    boundingRect: {width: 3, height: 2},
    tiles: {
      solid: [{width: 3, height: 1, offsetX: 0, offsetY: 0}],
      empty: [
	{width: 1, height: 1, offsetX: 0, offsetY: 1},
	{width: 1, height: 1, offsetX: 2, offsetY: 1},
      ],
      striped: [{width: 1, height: 1, offsetX: 1, offsetY: 1}]
    }
  },
  {
    category: 'Food',
    name: 'Algae Dispenser',
    boundingRect: {width: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 2, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Resource',
    name: 'Recycler',
    boundingRect: {width: 3, height: 4},
    tiles: {
      solid: [
	{width: 3, height: 2, offsetX: 0, offsetY: 0},
	{width: 2, height: 1, offsetX: 0, offsetY: 2}
      ],
      empty: [
	{width: 1, height: 1, offsetX: 2, offsetY: 2},
	{width: 3, height: 1, offsetX: 0, offsetY: 3}
      ]
    }
  },
  {
    category: 'Resource',
    name: 'Ore Processor',
    boundingRect: {width: 3, height: 6},
    tiles: {
      solid: [{width: 3, height: 5, offsetX: 0, offsetY: 0}],
      empty: [{width: 3, height: 1, offsetX: 0, offsetY: 5}]
    }
  },
  {
    category: 'Resource',
    name: 'Water Collector',
    boundingRect: {width: 1, height: 2},
    tiles: {
      solid: [{width: 1, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 1, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Resource',
    name: 'Water Purifier',
    boundingRect: {width: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 2, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Resource',
    name: 'Tools Facility',
    boundingRect: {width: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 2, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Resource',
    name: 'Item Workbench',
    boundingRect: {width: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 2, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Power',
    name: 'Large Power Node',
    boundingRect: {width: 1, height: 2},
    tiles: {
      solid: [{width: 1, height: 2, offsetX: 0, offsetY: 0}]
    }
  },,
  {
    category: 'Power',
    name: 'Small Power Node',
    boundingRect: {width: 1, height: 1},
    tiles: {
      solid: [{width: 1, height: 1, offsetX: 0, offsetY: 0}]
    }
  },
  {
    category: 'Power',
    name: 'Energium Power Generator',
    boundingRect: {width: 2, height: 4},
    tiles: {
      solid: [{width: 2, height: 3, offsetX: 0, offsetY: 0}],
      empty: [{width: 2, height: 1, offsetX: 0, offsetY: 3}]
    }
  },
  {
    category: 'Life Support',
    name: 'Air Vent',
    boundingRect: {width: 1, height: 2},
    tiles: {
      wall: [{width: 1, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 1, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Life Support',
    name: 'Thermal Regulator',
    boundingRect: {width: 1, height: 1},
    tiles: {
      solid: [{width: 1, height: 1, offsetX: 0, offsetY: 0}]
    }
  },
  {
    category: 'Life Support',
    name: 'Wall Thermal Regulator',
    boundingRect: {width: 1, height: 2},
    tiles: {
      wall: [{width: 1, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 1, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Life Support',
    name: 'Gas Scrubber',
    boundingRect: {width: 1, height: 2},
    tiles: {
      solid: [{width: 1, height: 1, offsetX: 0, offsetY: 0}],
      striped: [{width: 1, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Life Support',
    name: 'Oxygen Generator',
    boundingRect: {wdith: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 1, offsetX: 0, offsetY: 0}],
      striped: [{width: 1, height: 1, offsetX: 0, offsetY: 1}],
      empty: [{width: 1, height: 1, offsetX: 1, offsetY: 1}]
    }
  },
  {
    category: 'Facility',
    name: 'Research Workbench',
    boundingRect: {width: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 2, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Facility',
    name: 'Research Lab',
    boundingRect: {width: 3, height: 3},
    tiles: {
      solid: [{width: 3, height: 2, offsetX: 0, offsetY: 0}],
      empty: [{width: 3, height: 1, offsetX: 0, offsetY: 2}]
    }
  },
  {
    category: 'Facility',
    name: 'ISP Dispenser',
    boundingRect: {width: 1, height: 2},
    tiles: {
      wall: [{width: 1, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 1, height: 1, offsetX: 0, offsetY: 1}]
    }
  },
  {
    category: 'Facility',
    name: 'X1 Toilet',
    boundingRect: {wdith: 2, height: 2},
    tiles: {
      solid: [{width: 2, height: 1, offsetX: 0, offsetY: 0}],
      empty: [{width: 1, height: 1, offsetX: 0, offsetY: 1}],
      striped: [{width: 1, height: 1, offsetX: 1, offsetY: 1}],
    }
  }
]

