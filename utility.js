function generateRandomCircuit(size, variance, intervalCount) {
    const baseRadius = size * 0.35;
    const maxVariance = baseRadius * variance;

    // -------- 1. Generate raw noisy radii --------
    const radii = [];
    for (let i = 0; i < intervalCount; i++) {
        const noise = (Math.random() * 2 - 1) * maxVariance;
        radii.push(baseRadius + noise);
    }

    // -------- 2. Smooth with a simple kernel --------
    const smoothed = [];
    const kernel = [0.25, 0.5, 0.25];
    for (let i = 0; i < intervalCount; i++) {
        const prev = radii[(i - 1 + intervalCount) % intervalCount];
        const curr = radii[i];
        const next = radii[(i + 1) % intervalCount];
        smoothed[i] = prev * kernel[0] + curr * kernel[1] + next * kernel[2];
    }

    // -------- 3. Convert polar (r, θ) → (x, y) --------
    const rawPts = [];
    for (let i = 0; i < intervalCount; i++) {
        const angle = (i / intervalCount) * Math.PI * 2;
        const r = smoothed[i];
        rawPts.push([Math.cos(angle) * r, Math.sin(angle) * r]);
    }

    // Close loop (duplicate start)
    rawPts.push(rawPts[0].slice());

    // -------- 4. Compute cumulative arc length --------
    const lengths = [0];
    for (let i = 1; i < rawPts.length; i++) {
        const dx = rawPts[i][0] - rawPts[i - 1][0];
        const dy = rawPts[i][1] - rawPts[i - 1][1];
        lengths[i] = lengths[i - 1] + Math.sqrt(dx * dx + dy * dy);
    }

    const totalLength = lengths[lengths.length - 1];
    const targetSegLen = totalLength / intervalCount;

    // -------- 5. Resample at equal arc length steps --------
    const resampled = [];
    let ti = 0;

    for (let k = 0; k < intervalCount; k++) {
        const targetLen = k * targetSegLen;

        while (ti < lengths.length - 1 && lengths[ti + 1] < targetLen) {
            ti++;
        }

        const t0 = lengths[ti];
        const t1 = lengths[ti + 1];
        const ratio = (targetLen - t0) / (t1 - t0);

        const p0 = rawPts[ti];
        const p1 = rawPts[ti + 1];

        resampled.push([
            p0[0] + (p1[0] - p0[0]) * ratio,
            p0[1] + (p1[1] - p0[1]) * ratio
        ]);
    }

    // Close loop explicitly 
    resampled.push(resampled[0].slice());

    // -------- 7. Fit inside centered size × size bounds --------
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const [x, y] of resampled) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }

    const w = maxX - minX;
    const h = maxY - minY;
    const scale = Math.min(size / w, size / h, 1);

    // Scale
    for (let p of resampled) {
        p[0] *= scale;
        p[1] *= scale;
    }

    // -------- 8. Recenter around origin --------
    // After scaling, center the bounding box on (0,0)
    const newMinX = Math.min(...resampled.map(p => p[0]));
    const newMaxX = Math.max(...resampled.map(p => p[0]));
    const newMinY = Math.min(...resampled.map(p => p[1]));
    const newMaxY = Math.max(...resampled.map(p => p[1]));

    const offsetX = (newMinX + newMaxX) / 2;
    const offsetY = (newMinY + newMaxY) / 2;

    for (let p of resampled) {
        p[0] -= offsetX;
        p[1] -= offsetY;
    }

    return resampled;
}


function vectGroundTo3D(vector, yVal) {
    return [vector[0], yVal, vector[1]];
}


function vectorDistance(vector1, vector2) {
  // Ensure both inputs are arrays and have the same length
  if (!Array.isArray(vector1) || !Array.isArray(vector2) || vector1.length !== vector2.length) {
    throw new Error("Inputs must be arrays of the same length.");
  }

  let sumOfSquares = 0;
  for (let i = 0; i < vector1.length; i++) {
    const difference = vector1[i] - vector2[i];
    sumOfSquares += difference * difference;
  }

  return Math.sqrt(sumOfSquares);
}

function getAngleBetweenPoints(p1, p2) {
    let dir = [p2[0] - p1[0], p2[1] - p1[1]];
    const angleRadians = Math.atan2(dir[1], dir[0]);
    return angleRadians;
}

function getMidpoint2d(v1, v2) {
  const midpointX = (v1[0] + v2[0]) / 2;
  const midpointY = (v1[1] + v2[1]) / 2;
  return [midpointX, midpointY];
}

function getBallValueAtLevel(level) {
    return (15 / getMaxBallsAtLevel(level)) + 1;
}

function getMaxBallsAtLevel(level) {
    return Math.floor(5 + (level- 1) * 3)
}