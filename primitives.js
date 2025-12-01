class Primitive {
    constructor(positions, indices, colors) {
        this.positions = new Float32Array(positions);
        this.indices = new Uint16Array(indices);
        this.colors = new Float32Array(colors);

        this.posX = 0;
        this.posY = 0;
        this.posZ = 0;

        this.scaX = 1;
        this.scaY = 1;
        this.scaZ = 1;

        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;

        this.children = [];
    }

    setPos([x, y, z]) {
        this.posX = x;
        this.posY = y;
        this.posZ = z;
    }

    setSca([x, y, z]) {
        this.scaX = x;
        this.scaY = y;
        this.scaZ = z;
    }

    setRot([x, y, z]) {
        this.rotX = x;
        this.rotY = y;
        this.rotZ = z;
    }

    getRotationMatrix() {
        const cx = Math.cos(this.rotY), sx = Math.sin(this.rotY);
        const cy = Math.cos(this.rotX), sy = Math.sin(this.rotX);
        const cz = Math.cos(this.rotZ), sz = Math.sin(this.rotZ);

        const rotXMat = [
            1, 0, 0, 0,
            0, cy, sy, 0,
            0, -sy, cy, 0,
            0, 0, 0, 1
        ];

        const rotYMat = [
            cx, 0, -sx, 0,
            0, 1, 0, 0,
            sx, 0, cx, 0,
            0, 0, 0, 1
        ];

        const rotZMat = [
            cz, sz, 0, 0,
            -sz, cz, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        return multiplyMat4(multiplyMat4(rotYMat, rotXMat), rotZMat);
    }

    appendChild(child) {
        this.children.push(child);
    }
}

// =======================================================
// Helper Functions
// =======================================================

// If color not given → use random RGB
function defaultColor(color) {
    if (!color) {
        return [
            Math.random(),
            Math.random(),
            Math.random()
        ];
    }
    return color;
}

// Build a color array: per-vertex RGB
function makeColors(vertexCount, color) {
    const [r, g, b] = defaultColor(color);
    const arr = [];
    for (let i = 0; i < vertexCount; i++) {
        arr.push(r, g, b);
    }
    return arr;
}



// =======================================================
// 1. Cube
// =======================================================
function createCube(size = 1, color = null) {
    const s = size / 2;

    const positions = [
        -s, -s, -s, s, -s, -s, s, s, -s, -s, s, -s,
        -s, -s, s, s, -s, s, s, s, s, -s, s, s
    ];

    const indices = [
        4, 5, 6, 4, 6, 7,
        1, 0, 3, 1, 3, 2,
        3, 7, 6, 3, 6, 2,
        0, 1, 5, 0, 5, 4,
        1, 2, 6, 1, 6, 5,
        0, 4, 7, 0, 7, 3
    ];

    const colors = makeColors(8, color);

    return new Primitive(positions, indices, colors);
}



// =======================================================
// 2. Sphere
// =======================================================
function createSphere(radius = 1, segments = 32, color = null) {
    const positions = [];
    const indices = [];

    for (let y = 0; y <= segments; y++) {
        const v = y / segments;
        const theta = v * Math.PI;

        for (let x = 0; x <= segments; x++) {
            const u = x / segments;
            const phi = u * Math.PI * 2;

            positions.push(
                radius * Math.sin(theta) * Math.cos(phi),
                radius * Math.cos(theta),
                radius * Math.sin(theta) * Math.sin(phi)
            );
        }
    }

    const w = segments + 1;
    for (let y = 0; y < segments; y++) {
        for (let x = 0; x < segments; x++) {
            const i0 = y * w + x;
            const i1 = i0 + 1;
            const i2 = i0 + w;
            const i3 = i2 + 1;

            indices.push(i0, i2, i1);
            indices.push(i1, i2, i3);
        }
    }

    const colors = makeColors(positions.length / 3, color);
    return new Primitive(positions, indices, colors);
}



// =======================================================
// 3. Cylinder
// =======================================================
function createCylinder(radius = 1, height = 2, segments = 32, color = null) {
    const positions = [];
    const indices = [];

    const halfH = height / 2;

    // side vertices
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const a = t * Math.PI * 2;
        const x = radius * Math.cos(a);
        const z = radius * Math.sin(a);

        positions.push(x, -halfH, z);
        positions.push(x, halfH, z);
    }

    // side indices
    for (let i = 0; i < segments; i++) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
    }

    // top center
    const topCenter = positions.length / 3;
    positions.push(0, halfH, 0);

    // bottom center
    const bottomCenter = topCenter + 1;
    positions.push(0, -halfH, 0);

    // top cap
    for (let i = 0; i < segments; i++) {
        const a = i * 2 + 1;
        const b = ((i + 1) % segments) * 2 + 1;
        indices.push(topCenter, b, a);
    }

    // bottom cap
    for (let i = 0; i < segments; i++) {
        const a = i * 2;
        const b = ((i + 1) % segments) * 2;
        indices.push(bottomCenter, a, b);
    }

    const colors = makeColors(positions.length / 3, color);
    return new Primitive(positions, indices, colors);
}



// =======================================================
// 4. Cone
// =======================================================
function createCone(radius = 1, height = 2, segments = 32, color = null) {
    const positions = [];
    const indices = [];

    const halfH = height / 2;

    // apex
    const apex = positions.length / 3;
    positions.push(0, halfH, 0);

    // ring
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const a = t * 2 * Math.PI;
        positions.push(
            radius * Math.cos(a),
            -halfH,
            radius * Math.sin(a)
        );
    }

    // sides
    for (let i = 1; i <= segments; i++) {
        indices.push(apex, i + 1, i);
    }

    // bottom center
    const bottomCenter = positions.length / 3;
    positions.push(0, -halfH, 0);

    // bottom cap
    for (let i = 1; i <= segments; i++) {
        indices.push(bottomCenter, i, i + 1);
    }

    const colors = makeColors(positions.length / 3, color);
    return new Primitive(positions, indices, colors);
}



// =======================================================
// 5. Torus
// =======================================================
function createTorus(
    radius = 1,
    tubeRadius = 0.3,
    radialSegments = 32,
    tubularSegments = 32,
    color = null
) {
    const positions = [];
    const indices = [];

    for (let j = 0; j <= radialSegments; j++) {
        const v = j / radialSegments;
        const phi = v * 2 * Math.PI;

        for (let i = 0; i <= tubularSegments; i++) {
            const u = i / tubularSegments;
            const theta = u * 2 * Math.PI;

            positions.push(
                (radius + tubeRadius * Math.cos(theta)) * Math.cos(phi),
                tubeRadius * Math.sin(theta),
                (radius + tubeRadius * Math.cos(theta)) * Math.sin(phi)
            );
        }
    }

    const row = tubularSegments + 1;
    for (let j = 0; j < radialSegments; j++) {
        for (let i = 0; i < tubularSegments; i++) {
            const a = j * row + i;
            const b = a + row;

            indices.push(a, b, a + 1);
            indices.push(a + 1, b, b + 1);
        }
    }

    const colors = makeColors(positions.length / 3, color);
    return new Primitive(positions, indices, colors);
}



// =======================================================
// 6. Tetrahedron
// =======================================================
function createTetrahedron(size = 1, color = null) {
    const s = size / Math.sqrt(2);

    const positions = [
        s, s, s,
        -s, -s, s,
        -s, s, -s,
        s, -s, -s,
    ];

    const indices = [
        0, 1, 2,
        0, 3, 1,
        0, 2, 3,
        1, 3, 2
    ];

    const colors = makeColors(4, color);
    return new Primitive(positions, indices, colors);
}