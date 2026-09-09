/**
 * Fits a flat element onto a surface photographed at an angle.
 *
 * The first render was shot straight on, so the screen was an axis-aligned
 * rectangle and `left / top / width` was enough to place the panel on it. The
 * second is a three-quarter view: the screen is a trapezoid, and no
 * combination of offsets and sizes will land a rectangle on it.
 *
 * What does work is the transform that actually happened in the camera. Given
 * where the four corners of the screen ended up in the photograph, this solves
 * for the projective transform that maps the unit square onto them, and
 * returns it as a CSS `matrix3d`. The browser then does the same perspective
 * division the lens did.
 *
 * Because it is driven by corners rather than angles, it works for any
 * viewpoint: this render, a future one, or a real photograph on a desk.
 */

export type Corner = { x: number; y: number };

/** Clockwise from the top left, in the same units as `width` and `height`. */
export type Quad = {
  topLeft: Corner;
  topRight: Corner;
  bottomRight: Corner;
  bottomLeft: Corner;
};

/**
 * Solves a linear system by Gaussian elimination with partial pivoting.
 * Small and dense: eight equations, eight unknowns.
 */
function solve(matrix: number[][], vector: number[]): number[] | null {
  const n = vector.length;
  const a = matrix.map((row, i) => [...row, vector[i]]);

  for (let col = 0; col < n; col++) {
    // Pivot on the largest remaining value in this column, for stability.
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    }
    if (Math.abs(a[pivot][col]) < 1e-12) return null; // degenerate quad
    [a[col], a[pivot]] = [a[pivot], a[col]];

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = a[row][col] / a[col][col];
      for (let k = col; k <= n; k++) a[row][k] -= factor * a[col][k];
    }
  }

  return a.map((row, i) => row[n] / row[i]);
}

/**
 * The CSS transform mapping a `width` by `height` box onto `quad`.
 *
 * Apply with `transform-origin: 0 0`, on an element of exactly that size.
 * Returns null if the corners do not describe a usable quadrilateral, so the
 * caller can fall back to showing the photograph untouched.
 */
export function quadTransform(
  width: number,
  height: number,
  quad: Quad,
): string | null {
  const from: Corner[] = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
  const to = [quad.topLeft, quad.topRight, quad.bottomRight, quad.bottomLeft];

  /* Each corner gives two equations. The ninth coefficient of the projective
     matrix is fixed at 1, which leaves eight unknowns. */
  const rows: number[][] = [];
  const values: number[] = [];

  for (let i = 0; i < 4; i++) {
    const { x, y } = from[i];
    const { x: u, y: v } = to[i];
    rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    values.push(u);
    rows.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    values.push(v);
  }

  const h = solve(rows, values);
  if (!h) return null;
  if (h.some((value) => !Number.isFinite(value))) return null;

  const [a, b, c, d, e, f, g, i] = h;

  /* matrix3d is column-major, and the flat case leaves the z row and column
     as identity. */
  return `matrix3d(${a}, ${d}, 0, ${g}, ${b}, ${e}, 0, ${i}, 0, 0, 1, 0, ${c}, ${f}, 0, 1)`;
}
