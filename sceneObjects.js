const globalObjects = [];
const globalColliders = [];

/* VEHICLE */
let kartBase = createCube(.1);
kartBase.createCollider(false);
kartBase.collider.setScale([0.001, 0.001, 0.001]); 

let chassis = createCube(2, [0.9, .02, 0.03]);
chassis.scaY = 0.3;
chassis.scaX = .75;
chassis.scaZ = 1.5;
chassis.setMaterial({
    ambient: 0.1,
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
kartBase.appendChild(chassis);

//Rear axle
let axleRear = createCylinder(.1, 2, 8, [0.6, 0.6, 0.6]);
axleRear.rotX = Math.PI / 2;
axleRear.rotY = Math.PI / 2;
axleRear.posZ = 1.3;
axleRear.setMaterial({
    ambient: 0.1,
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
let wheelRL = createCylinder(.5,.25, 32, [0.35, 0.35, 0.35],"textures/tire.png");
wheelRL.posY = -1;
wheelRL.setMaterial({
    ambient: 0.2,
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleRear.appendChild(wheelRL);
let wheelRR = createCylinder(.5,.25, 32, [0.35, 0.35, 0.35],"textures/tire.png");
wheelRR.posY = 1;
wheelRR.setMaterial({
    ambient: 0.2,
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleRear.appendChild(wheelRR);

kartBase.appendChild(axleRear);

//Front axles
let axleFR = createCylinder(.1, .8, 8, [0.6, 0.6, 0.6]);
axleFR.rotX = Math.PI / 2;
axleFR.rotY = Math.PI / 2;
axleFR.posZ = -1.1;
axleFR.posX = .5;
axleFR.setMaterial({
    ambient: 0.1,
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
let wheelFR = createCylinder(.5,.25, 32, [0.35, 0.35, 0.35],"textures/tire.png");
wheelFR.posY = .5;
wheelFR.setMaterial({
    ambient: 0.2,
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleFR.appendChild(wheelFR);

let axleFL = createCylinder(.1, .8, 8, [0.6, 0.6, 0.6]);
axleFL.rotX = Math.PI / 2;
axleFL.rotY = Math.PI / 2;
axleFL.posZ = -1.1;
axleFL.posX = -.5;
axleFL.setMaterial({
    ambient: 0.1,
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
let wheelFL = createCylinder(.5,.25, 32, [0.35, 0.35, 0.35],"textures/tire.png");
wheelFL.posY = -.5;
wheelFL.setMaterial({
    ambient: 0.2,
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleFL.appendChild(wheelFL);

kartBase.appendChild(axleFR);
kartBase.appendChild(axleFL);


/* OBSTACLES */
// let cube1 = createCube(4);
// cube1.setPos([-1, 1, -10]);
// cube1.setRot([0, 1, 0]);
// globalObjects.push(cube1);

// let cube2 = createCube(2);
// cube2.setPos([0, 1, 0]);
// cube2.setSca([1, 5, 1]);
// cube2.setRot([1, 0, 0]);
// cube1.appendChild(cube2);

//random obstacles
const obstacleCount = 20;
const xMin = -5; const xMax = -100;
const zMin = -5; const zMax = -100;
const obstacleSize = 4;

for(let i = 0; i < obstacleCount; i++){
    let obs = createCube(1, null,"textures/test.jpg");
    posX = xMin + (Math.random() * (xMax - xMin));
    posZ = zMin + (Math.random() * (zMax - zMin));
    obs.setPos([posX, 1, posZ])
    obs.setSca([obstacleSize, obstacleSize, obstacleSize]);
    obs.setRot([0, Math.random() * Math.PI, 0])
    obs.createCollider(true);
    globalObjects.push(obs);
}


const areaSize = 200;

/* GROUND */
const groundMinX = -(areaSize / 2);
const groundMaxX = (areaSize / 2);
const groundMinZ = -(areaSize / 2);
const groundMaxZ = (areaSize / 2);
const groundPanelSize = 10;
const groundBrightnessVariance = .05;
for(let i = groundMinX; i <= groundMaxX; i+=groundPanelSize) {
    for(let j = groundMinZ; j <= groundMaxZ; j+=groundPanelSize){
        let gbv = (Math.random() - 0.5) * groundBrightnessVariance;
        let floor = createPlane(groundPanelSize, groundPanelSize, [0.01,0.35 + gbv,0.01], "textures/noiseTexture_bump.png");
        floor.setPos([i, -.5, j]);
        floor.setMaterial({
            ambient: 0.3,
            diffuse: 0.7,
            specular: 0.2,
            shininess: 4
        });
        globalObjects.push(floor);
    }
}

/* ROAD */
const roadSegments = 200;
const roadWidth = 10;
const roadHeight = -.49;
let circuit = generateRandomCircuit(areaSize, .05, roadSegments);
for(let i = 0; i < circuit.length - 1; i++){
    let coord = circuit[i];
    let coordNext = circuit[i + 1];
    let rsDist = vectorDistance(coordNext, coord);
    let rsAngle = getAngleBetweenPoints(coord, coordNext);
    let rs = createPlane(roadWidth, rsDist * 3, [0.3, 0.3, 0.33], "textures/noiseTexture_bump.png"); 
    rs.setRot([0, rsAngle, 0]);
    let mid2d = getMidpoint2d(coord, coordNext);
    let midPoint = vectGroundTo3D(mid2d, roadHeight);
    rs.setPos(midPoint);
    globalObjects.push(rs);
}

/* WALLS */
const walls = [];
const wallLength = areaSize;
const wallHeight = 20;
for(let i = 0; i < 4; i++){
    let w = createCube(1, [.5, .5, .5], 'textures/noiseTexture_bump.png');
    w.setSca([1, wallHeight, wallLength]);
    w.setRot([0, (Math.PI/2) * i, 0]);
    let posX = i == 0 ? groundMinX : i == 2 ? groundMaxX : 0;
    let posZ = i == 1 ? groundMinZ : i == 3 ? groundMaxZ : 0;
    w.setPos([posX, (wallHeight / 2 - 0.5), posZ]);
    w.createCollider(true);
    globalObjects.push(w);
}