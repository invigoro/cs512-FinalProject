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
        this.transform = multiplyMat4(this.parentTransform, mat4Scale(mat4Identity(), [this.scaX, this.scaY, this.scaZ]));
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

}