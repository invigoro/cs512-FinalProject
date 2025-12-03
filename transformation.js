// Matrix functions
// Perspective matrix
function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}

// Orthographic matrix
function ortho(left, right, bottom, top, near, far) {
    const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
    return [-2 * lr, 0, 0, 0, 0, -2 * bt, 0, 0, 0, 0, 2 * nf, 0, (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1];
}

// Identity matrix
function mat4Identity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

// Matrix translation
function mat4Translate(matrix, translation) {
    const result = new Float32Array(matrix);
    result[12] = matrix[0] * translation[0] + matrix[4] * translation[1] + matrix[8] * translation[2] + matrix[12];
    result[13] = matrix[1] * translation[0] + matrix[5] * translation[1] + matrix[9] * translation[2] + matrix[13];
    result[14] = matrix[2] * translation[0] + matrix[6] * translation[1] + matrix[10] * translation[2] + matrix[14];
    result[15] = matrix[3] * translation[0] + matrix[7] * translation[1] + matrix[11] * translation[2] + matrix[15];
    return result;
}

// Matrix rotation around X axis
function mat4RotateX(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const result = new Float32Array(matrix);

    const mv1 = matrix[4], mv5 = matrix[5], mv9 = matrix[6], mv13 = matrix[7];
    const mv2 = matrix[8], mv6 = matrix[9], mv10 = matrix[10], mv14 = matrix[11];

    result[4] = mv1 * c + mv2 * s;
    result[5] = mv5 * c + mv6 * s;
    result[6] = mv9 * c + mv10 * s;
    result[7] = mv13 * c + mv14 * s;
    result[8] = mv2 * c - mv1 * s;
    result[9] = mv6 * c - mv5 * s;
    result[10] = mv10 * c - mv9 * s;
    result[11] = mv14 * c - mv13 * s;

    return result;
}

// Matrix rotation around Y axis
function mat4RotateY(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const result = new Float32Array(matrix);

    const mv0 = matrix[0], mv4 = matrix[1], mv8 = matrix[2], mv12 = matrix[3];
    const mv2 = matrix[8], mv6 = matrix[9], mv10 = matrix[10], mv14 = matrix[11];

    result[0] = mv0 * c - mv2 * s;
    result[1] = mv4 * c - mv6 * s;
    result[2] = mv8 * c - mv10 * s;
    result[3] = mv12 * c - mv14 * s;
    result[8] = mv0 * s + mv2 * c;
    result[9] = mv4 * s + mv6 * c;
    result[10] = mv8 * s + mv10 * c;
    result[11] = mv12 * s + mv14 * c;

    return result;
}

// Matrix multiplication
function multiplyMat4(a, b) {
    let r = new Float32Array(16);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
            sum += a[k * 4 + i] * b[j * 4 + k];
        }
        r[j * 4 + i] = sum;
    }
    return r;
}

function mat4Scale(m, s) {
    let result = new Float32Array(16);
    // Scale all columns by the respective scale factors
    for (let i = 0; i < 4; i++) {
        result[i]      = m[i]      * s[0];  // X column
        result[i + 4]  = m[i + 4]  * s[1];  // Y column
        result[i + 8]  = m[i + 8]  * s[2];  // Z column
        result[i + 12] = m[i + 12];         
    }
    return result;
}

function mat4Inverse(m) {
    const inv = new Float32Array(16);
    const det =
        m[0] * (m[5]*m[10] - m[6]*m[9]) -
        m[1] * (m[4]*m[10] - m[6]*m[8]) +
        m[2] * (m[4]*m[9] - m[5]*m[8]);

    if (Math.abs(det) < 1e-8) {
        console.warn("Matrix is singular and cannot be inverted");
        return mat4Identity();
    }

    const invDet = 1.0 / det;

    // Compute inverse of upper-left 3x3 (rotation*scale)
    inv[0] = (m[5]*m[10] - m[6]*m[9]) * invDet;
    inv[1] = (m[2]*m[9] - m[1]*m[10]) * invDet;
    inv[2] = (m[1]*m[6] - m[2]*m[5]) * invDet;
    inv[3] = 0;

    inv[4] = (m[6]*m[8] - m[4]*m[10]) * invDet;
    inv[5] = (m[0]*m[10] - m[2]*m[8]) * invDet;
    inv[6] = (m[2]*m[4] - m[0]*m[6]) * invDet;
    inv[7] = 0;

    inv[8] = (m[4]*m[9] - m[5]*m[8]) * invDet;
    inv[9] = (m[1]*m[8] - m[0]*m[9]) * invDet;
    inv[10] = (m[0]*m[5] - m[1]*m[4]) * invDet;
    inv[11] = 0;

    // Inverse translation
    inv[12] = -(inv[0]*m[12] + inv[4]*m[13] + inv[8]*m[14]);
    inv[13] = -(inv[1]*m[12] + inv[5]*m[13] + inv[9]*m[14]);
    inv[14] = -(inv[2]*m[12] + inv[6]*m[13] + inv[10]*m[14]);
    inv[15] = 1;

    return inv;
}

function mat3FromMat4(m4) {
    // m4 is a Float32Array[16] in column-major order
    return new Float32Array([
        m4[0], m4[1], m4[2],
        m4[4], m4[5], m4[6],
        m4[8], m4[9], m4[10]
    ]);
}
function mat3InvertTranspose(m) {
    // m is Float32Array[9]
    const a11 = m[0], a12 = m[1], a13 = m[2];
    const a21 = m[3], a22 = m[4], a23 = m[5];
    const a31 = m[6], a32 = m[7], a33 = m[8];

    const b11 =  a22 * a33 - a23 * a32;
    const b12 = -a21 * a33 + a23 * a31;
    const b13 =  a21 * a32 - a22 * a31;

    const det = a11 * b11 + a12 * b12 + a13 * b13;

    if (Math.abs(det) < 1e-8) {
        // Degenerate — return identity to avoid NaN
        return new Float32Array([
            1,0,0,
            0,1,0,
            0,0,1
        ]);
    }

    const invDet = 1.0 / det;

    // Inverse matrix (not transposed yet)
    const inv = new Float32Array([
        b11 * invDet,
        (-a12 * a33 + a13 * a32) * invDet,
        ( a12 * a23 - a13 * a22) * invDet,

        b12 * invDet,
        ( a11 * a33 - a13 * a31) * invDet,
        (-a11 * a23 + a13 * a21) * invDet,

        b13 * invDet,
        (-a11 * a32 + a12 * a31) * invDet,
        ( a11 * a22 - a12 * a21) * invDet
    ]);

    // Return transpose(inv)
    return new Float32Array([
        inv[0], inv[3], inv[6],
        inv[1], inv[4], inv[7],
        inv[2], inv[5], inv[8]
    ]);
}
