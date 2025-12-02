class Primitive {
    constructor(positions, indices, colors, normals, texCoords = null, textureUrl = null) {
        this.positions = new Float32Array(positions);
        this.indices = new Uint16Array(indices);
        this.colors = new Float32Array(colors);
        this.normals = new Float32Array(normals);

        this.textureUrl = textureUrl;
        this.texture = null;
        this.hasTexture = !!textureUrl;
        this.texCoords = texCoords ? new Float32Array(texCoords) : null;

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

        this.kAmbient  = 0.5;
        this.kDiffuse  = 0.7;
        this.kSpecular = 0.5;
        this.shininess = 32;

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
    setMaterial({ ambient, diffuse, specular, shininess }) {
        if (ambient   !== undefined) this.kAmbient  = ambient;
        if (diffuse   !== undefined) this.kDiffuse  = diffuse;
        if (specular  !== undefined) this.kSpecular = specular;
        if (shininess !== undefined) this.shininess = shininess;
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
function createCube(size = 1, color = null, textureUrl = null) {
    const s = size / 2;

    const positions = [
        -s, -s,  s,   s, -s,  s,   s,  s,  s,  -s,  s,  s,
         s, -s, -s,  -s, -s, -s,  -s,  s, -s,   s,  s, -s,
        -s, -s, -s,  -s, -s,  s,  -s,  s,  s,  -s,  s, -s,
         s, -s,  s,   s, -s, -s,   s,  s, -s,   s,  s,  s,
        -s,  s,  s,   s,  s,  s,   s,  s, -s,  -s,  s, -s,
        -s, -s, -s,   s, -s, -s,   s, -s,  s,  -s, -s,  s,
    ];

    const indices = [
        0,1,2, 0,2,3,
        4,5,6, 4,6,7,
        8,9,10, 8,10,11,
        12,13,14, 12,14,15,
        16,17,18, 16,18,19,
        20,21,22, 20,22,23
    ];
    const normals = computeNormals(positions, indices);
    const colors = makeColors(24, color);

    let texCoords = [];
    if(textureUrl!=null){

    texCoords = [
        0, 1, 1, 1, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0, 0
    ];

    }

    return new Primitive(positions, indices, colors, normals, texCoords, textureUrl);
}



// =======================================================
// 2. Sphere
// =======================================================
function createSphere(radius = 1, segments = 32, color = null) {
    const positions = [];
    const normals   = [];
    const indices   = [];

    for (let y = 0; y <= segments; y++) {
        const v = y / segments;
        const theta = v * Math.PI;

        for (let x = 0; x <= segments; x++) {
            const u = x / segments;
            const phi = u * 2 * Math.PI;

            const px = radius * Math.sin(theta) * Math.cos(phi);
            const py = radius * Math.cos(theta);
            const pz = radius * Math.sin(theta) * Math.sin(phi);

            positions.push(px,py,pz);

            // sphere normal = normalized position
            const len = Math.hypot(px,py,pz);
            normals.push(px/len, py/len, pz/len);
        }
    }

    const w = segments+1;
    for (let y = 0; y < segments; y++) {
        for (let x = 0; x < segments; x++) {
            const i0 = y*w + x;
            const i1 = i0 + 1;
            const i2 = i0 + w;
            const i3 = i2 + 1;

            indices.push(i0,i2,i1);
            indices.push(i1,i2,i3);
        }
    }

    const colors = makeColors(positions.length/3, color);
    return new Primitive(positions, indices, colors, normals);
}



// =======================================================
// 3. Cylinder
// =======================================================
function createCylinder(radius = 1, height = 2, segments = 32, color = null, textureUrl = null) {
    const positions = [];
    const normals   = [];
    const indices   = [];
    const texCoords = [];

    const halfH = height/2;

    // side vertices
    for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * 2*Math.PI;
        const x = Math.cos(t), z = Math.sin(t);
        const u = i / segments;

        // bottom
        positions.push(radius*x, -halfH, radius*z);
        normals.push(x, 0, z);
        texCoords.push(u, 0);

        // top
        positions.push(radius*x, halfH, radius*z);
        normals.push(x, 0, z);
        texCoords.push(u, 1);
    }

    // side triangles
    for (let i = 0; i < segments; i++) {
        const b = i*2;
        indices.push(b, b+1, b+2);
        indices.push(b+1, b+3, b+2);
    }

    // top center
    const topCenter = positions.length/3;
    positions.push(0, halfH, 0);
    normals.push(0,1,0);
    texCoords.push(0.5, 0.5);

    // bottom center
    const bottomCenter = topCenter+1;
    positions.push(0,-halfH,0);
    normals.push(0,-1,0);
    texCoords.push(0.5, 0.5);

    // top cap
    for (let i = 0; i < segments; i++) {
        const a = i*2+1;
        const b = ((i+1)%segments)*2 + 1;
        indices.push(topCenter, b, a);
    }

    // bottom cap
    for (let i = 0; i < segments; i++) {
        const a = i*2;
        const b = ((i+1)%segments)*2;
        indices.push(bottomCenter, a, b);
    }

    const colors = makeColors(positions.length/3, color);

    let finalTexCoords = [];
    if(textureUrl!=null){
        finalTexCoords = texCoords;



    }
    return new Primitive(positions, indices, colors, normals, finalTexCoords, textureUrl);
}



// =======================================================
// 4. Cone
// =======================================================
function createCone(radius = 1, height = 2, segments = 32, color = null) {
    const positions = [];
    const normals   = [];
    const indices   = [];

    const halfH = height/2;
    const slope = radius / height;

    // apex
    const apex = positions.length/3;
    positions.push(0, halfH, 0);
    normals.push(0,1,0); // approximated (doesn't matter much for 1 point)

    // ring
    for (let i = 0; i <= segments; i++) {
        const t = (i/segments)*2*Math.PI;
        const x = Math.cos(t), z = Math.sin(t);

        positions.push(radius*x, -halfH, radius*z);

        // normalized normal for cone side
        const nx = x;
        const ny = slope;
        const nz = z;
        const l = Math.hypot(nx,ny,nz);

        normals.push(nx/l, ny/l, nz/l);
    }

    // side faces
    for (let i = 1; i <= segments; i++) {
        indices.push(apex, i+1, i);
    }

    // bottom center
    const bottomCenter = positions.length/3;
    positions.push(0, -halfH, 0);
    normals.push(0,-1,0);

    // bottom cap
    for (let i = 1; i <= segments; i++) {
        indices.push(bottomCenter, i, i+1);
    }

    const colors = makeColors(positions.length/3, color);
    return new Primitive(positions, indices, colors, normals);
}



// =======================================================
// 5. Torus
// =======================================================
function createTorus(radius = 1, tubeRadius = 0.3, radialSegments = 32, tubularSegments = 32, color=null) {
    const positions = [];
    const normals   = [];
    const indices   = [];

    for (let j = 0; j <= radialSegments; j++) {
        const v = j / radialSegments;
        const phi = v * 2 * Math.PI;

        for (let i = 0; i <= tubularSegments; i++) {
            const u = i / tubularSegments;
            const theta = u * 2 * Math.PI;

            const cx = Math.cos(phi), sx = Math.sin(phi);
            const ct = Math.cos(theta), st = Math.sin(theta);

            positions.push(
                (radius + tubeRadius * ct) * cx,
                tubeRadius * st,
                (radius + tubeRadius * ct) * sx
            );

            const nx = ct * cx;
            const ny = st;
            const nz = ct * sx;
            const l = Math.hypot(nx,ny,nz);

            normals.push(nx/l, ny/l, nz/l);
        }
    }

    const row = tubularSegments+1;
    for (let j = 0; j < radialSegments; j++) {
        for (let i = 0; i < tubularSegments; i++) {
            const a = j*row + i;
            const b = a + row;

            indices.push(a,b,a+1);
            indices.push(a+1,b,b+1);
        }
    }

    const colors = makeColors(positions.length/3, color);
    return new Primitive(positions, indices, colors, normals);
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
        0,1,2,
        0,3,1,
        0,2,3,
        1,3,2
    ];

    const normals = computeNormals(positions, indices);
    const colors = makeColors(4, color);

    return new Primitive(positions, indices, colors, normals);
}

function computeNormals(positions, indices) {
    const normals = new Array(positions.length).fill(0);

    for (let i = 0; i < indices.length; i += 3) {
        const i0 = indices[i] * 3;
        const i1 = indices[i+1] * 3;
        const i2 = indices[i+2] * 3;

        const p0 = positions.slice(i0, i0+3);
        const p1 = positions.slice(i1, i1+3);
        const p2 = positions.slice(i2, i2+3);

        // compute face normal
        const v1 = [
            p1[0]-p0[0],
            p1[1]-p0[1],
            p1[2]-p0[2]
        ];
        const v2 = [
            p2[0]-p0[0],
            p2[1]-p0[1],
            p2[2]-p0[2]
        ];

        const nx = v1[1]*v2[2] - v1[2]*v2[1];
        const ny = v1[2]*v2[0] - v1[0]*v2[2];
        const nz = v1[0]*v2[1] - v1[1]*v2[0];

        // accumulate
        normals[i0]   += nx; normals[i0+1]   += ny; normals[i0+2]   += nz;
        normals[i1]   += nx; normals[i1+1]   += ny; normals[i1+2]   += nz;
        normals[i2]   += nx; normals[i2+1]   += ny; normals[i2+2]   += nz;
    }

    // normalize all
    for (let i = 0; i < normals.length; i += 3) {
        const x = normals[i], y = normals[i+1], z = normals[i+2];
        const l = Math.hypot(x,y,z) || 1.0;
        normals[i] = x/l; normals[i+1] = y/l; normals[i+2] = z/l;
    }
    return normals;
}
