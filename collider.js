class Collider {
    //Box collider only. maybe will do sphere and/or cylinder later, idk
    constructor() {
        this.setScale([1, 1, 1]);
        this.updateParentTransform(mat4Identity());
    }

    setScale([x, y, z]) {
        this.scaX = x;
        this.scaY = y;
        this.scaZ = z;
    }

    updateParentTransform(transform) {
        this.parentTransform = transform;
        this.calculateTransform();
        this.calculatePoints();
    }

calculateTransform() {
    this.transform = mat4Scale(this.parentTransform, [this.scaX, this.scaY, this.scaZ]);
}

    calculatePoints() {
        this.points = this.transformUnitCubeVertices(this.transform);
    }

    transformUnitCubeVertices(mat4) {
        // 8 vertices of a unit cube centered at origin
        const vertices = [
            [-1, -1, -1],
            [1, -1, -1],
            [1, 1, -1],
            [-1, 1, -1],
            [-1, -1, 1],
            [1, -1, 1],
            [1, 1, 1],
            [-1, 1, 1]
        ];

        const transformed = [];

        for (const v of vertices) {
            const x = v[0], y = v[1], z = v[2];

            const tx =
                mat4[0] * x + mat4[4] * y + mat4[8] * z + mat4[12];
            const ty =
                mat4[1] * x + mat4[5] * y + mat4[9] * z + mat4[13];
            const tz =
                mat4[2] * x + mat4[6] * y + mat4[10] * z + mat4[14];
            const tw =
                mat4[3] * x + mat4[7] * y + mat4[11] * z + mat4[15];

            // Perspective divide if needed
            const w = tw === 0 ? 1 : tw;

            transformed.push([tx / w, ty / w, tz / w]);
        }

        return transformed;
    }

    checkOverlap(other) {
        return cubesOverlap(this.points, other);
    }
}

// Dot product of two 3D vectors
function dot(a, b) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

// Subtraction
function sub(a, b) {
  return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
}

// Vector normalization
function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]);
  return len === 0 ? [0,0,0] : [v[0]/len, v[1]/len, v[2]/len];
}

// Compute an orthonormal basis for a cube from its 8 vertices
function buildOBB(points) {
  // Compute center (avg of all vertices)
  let cx = 0, cy = 0, cz = 0;
  for (const p of points) {
    cx += p[0];
    cy += p[1];
    cz += p[2];
  }
  const center = [cx/8, cy/8, cz/8];

  // Assume cube indices in this order:
  // 0-3 = bottom square, 4-7 = top square
  const p0 = points[0];
  const p1 = points[1];
  const p3 = points[3];
  const p4 = points[4];

  // Three principal directions
  const xAxis = normalize(sub(p1, p0));
  const yAxis = normalize(sub(p3, p0));
  const zAxis = normalize(sub(p4, p0));

  // Half-extents in each axis
  const hx = dot(sub(p1, p0), xAxis) / 2;
  const hy = dot(sub(p3, p0), yAxis) / 2;
  const hz = dot(sub(p4, p0), zAxis) / 2;

  return {
    center,
    axes: [xAxis, yAxis, zAxis],
    halfExtents: [Math.abs(hx), Math.abs(hy), Math.abs(hz)]
  };
}

// Check if projections on a given axis overlap
function satAxisTest(axis, cA, cB, aAxes, bAxes, aExt, bExt) {
  const eps = 1e-6;

  // Skip near-zero axes
  const len = Math.hypot(axis[0], axis[1], axis[2]);
  if (len < eps) return true;

  const n = [axis[0]/len, axis[1]/len, axis[2]/len]; // normalized axis

  // Distance between OBB centers projected onto axis
  const centerDist = dot(sub(cB, cA), n);

  // Project each OBB's half extents onto this axis
  let rA = 0;
  let rB = 0;

  for (let i = 0; i < 3; i++) {
    rA += Math.abs(dot(aAxes[i], n)) * aExt[i];
    rB += Math.abs(dot(bAxes[i], n)) * bExt[i];
  }

  // SAT check: if centers separate more than extents, no overlap
  return Math.abs(centerDist) <= (rA + rB);
}

// Main intersection test
function cubesOverlap(cubeA, cubeB) {
  const A = buildOBB(cubeA);
  const B = buildOBB(cubeB);

  const aAxes = A.axes;
  const bAxes = B.axes;

  // 1. Test face normals of A
  for (let i = 0; i < 3; i++) {
    if (!satAxisTest(aAxes[i], A.center, B.center,
                     aAxes, bAxes, A.halfExtents, B.halfExtents))
      return false;
  }

  // 2. Test face normals of B
  for (let i = 0; i < 3; i++) {
    if (!satAxisTest(bAxes[i], A.center, B.center,
                     aAxes, bAxes, A.halfExtents, B.halfExtents))
      return false;
  }

  // 3. Test cross products of axes
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const axis = [
        aAxes[i][1] * bAxes[j][2] - aAxes[i][2] * bAxes[j][1],
        aAxes[i][2] * bAxes[j][0] - aAxes[i][0] * bAxes[j][2],
        aAxes[i][0] * bAxes[j][1] - aAxes[i][1] * bAxes[j][0]
      ];

      if (!satAxisTest(axis, A.center, B.center,
                       aAxes, bAxes, A.halfExtents, B.halfExtents))
        return false;
    }
  }

  return true; // All tests passed → overlap
}