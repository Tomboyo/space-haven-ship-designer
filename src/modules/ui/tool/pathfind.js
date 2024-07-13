// TODO: need to path around modules.
// Easiest way is to keep a separate 2D bitmask that tracks pathability of tiles.
// Update it when modules or tiles are changed.
/**
 * Find the shortest path between two ponts using A*.
 *
 * The first element of the returned array is always the finish tile.
 *
 * @param tiles: A 2D bitmask where 'true' indicates a pathable tile
 * @param sx: The x-coordinate to path from
 * @param sy: The y-coordinate to path from
 * @param fx: The x-coordinate to path to
 * @param fy: The y-coordinate to path to
 */
export default function pathfind(tiles, sx, sy, fx, fy) {
  if (!tiles[sx]?.[sy] || !tiles[fx]?.[fy]) {
    return null;
  }

  if (sx === fx && sy == fy) {
    return [[fx, fy]];
  }

  const start = [sx, sy];
  let parents = [];
  parents[start] = null;
  let gScores = [];
  gScores[start] = 0;
  let q = new MinPriorityQueue();
  let i = start;
  while (i && (i[0] !== fx || i[1] !== fy)) {
    let ns = neighbors(tiles, i[0], i[1]);
    for (let j = 0; j < ns.length; j++) {
      let n = ns[j];
      if (parents[n] !== undefined) {
        continue;
      }
      parents[n] = i;
      q.push(gScores[i] + 1 + taxicab(n[0], n[1], fx, fy), n);
      gScores[n] = gScores[i] + 1;
    }
    [, i] = q.pop();
  }

  if (i === null) {
    return null;
  }

  let acc = [i];
  while (parents[i] !== null) {
    acc.push(parents[i]);
    i = parents[i];
  }
  return acc;
}

function taxicab(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function neighbors(tiles, x, y) {
  let acc = [];
  if (tiles[x + 1]?.[y]) {
    acc.push([x + 1, y]);
  }
  if (tiles[x - 1]?.[y]) {
    acc.push([x - 1, y]);
  }
  if (tiles[x]?.[y + 1]) {
    acc.push([x, y + 1]);
  }
  if (tiles[x]?.[y - 1]) {
    acc.push([x, y - 1]);
  }
  return acc;
}

class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  push(key, value) {
    this.heap[this.heap.length] = [key, value];

    // Maintain heap invarient (lift up)
    let i = this.heap.length - 1;
    while (i > 0) {
      let p = this.#parent(i);
      if (this.heap[p][0] <= this.heap[i][0]) {
        break;
      }
      this.#swap(i, p);
      i = p;
    }
  }

  pop() {
    if (this.heap.length === 0) {
      return [null, null];
    }

    let tmp = this.heap[0];

    this.#swap(0, this.heap.length - 1);
    this.heap = this.heap.slice(0, this.heap.length - 1);

    // Maintain heap invarient (sink down)
    // (this.size / 2) is the first leaf node. All leaf nodes are already heaps.
    let i = 0;
    let s = this.heap.length >>> 1;
    while (i < s) {
      let l = this.#left(i);
      let r = this.#right(i);
      let min = i;
      if (this.heap[l][0] < this.heap[min][0]) {
        min = l;
      }
      if (this.heap[r] && this.heap[r][0] < this.heap[min][0]) {
        min = r;
      }
      if (min === i) {
        break;
      } else {
        this.#swap(i, min);
        i = min;
      }
    }

    return tmp;
  }

  #parent(i) {
    return ((i + 1) >>> 1) - 1;
  }

  #left(i) {
    return ((i + 1) << 1) - 1;
  }

  #right(i) {
    return (i + 1) << 1;
  }

  #swap(i, j) {
    let tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }
}
