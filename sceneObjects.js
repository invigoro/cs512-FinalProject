const globalObjects = [];
const bounceColliders = [];
const ballColliders = [];
const speedColliders = [];
const mudColliders = [];
const roadColliders = [];
const obstaclePositions = [];
let loadedImages = {};

/* VEHICLE */
let kartBase;
let axleRotY;
let wheelRL, wheelRR, wheelFR, wheelFL;
let axleRear, axleFR, axleFL;
let partL, partR;


function makeParticleGrass() {
    let s = createCube(.08, [0.01,0.35,0.01]);
    s.setMaterial({
        ambient: 0.2,
        diffuse: 0.3,
        shininess: 128
    })
    s.setPos([0,1,0]);
    return s;
}

function makeParticleMud() {
    let s = createCube(.1, [0.3, 0.2, 0.01]);
    s.setMaterial({
        ambient: 0.2,
        diffuse: 0.3,
        shininess: 128
    })
    s.setPos([0,1,0]);
    return s;
}function makeParticleSmoke() {
    let s = createCube(.1, [1, 1, 1]);
    s.setMaterial({
        ambient: 0.2,
        diffuse: 0.3,
        shininess: 128
    })
    s.setPos([0,1,0]);
    return s;
}

function createScene(scale = 1) {
    loadedImages = {};
    globalObjects.length = 0;
    bounceColliders.length = 0;
    ballColliders.length = 0;
    roadColliders.length = 0;
    speedColliders.length = 0;
    mudColliders.length = 0;
    obstaclePositions.length = 0;
    const areaSize = 250;
    kartBase = null;

    kartBase = createCube(.1);
kartBase.createCollider();
kartBase.collider.setScale([1.2,0.5,1.45]); 

let carColor = [0.9, .02, 0.03];
let carMaterial = 
{
    diffuse: .1,
    specular: 3.0,
    shininess: 30
};
let chassis = createCube(2, carColor);
chassis.scaY = 0.3;
chassis.scaX = .75;
chassis.scaZ = 1.5;
chassis.setMaterial(carMaterial);
kartBase.appendChild(chassis);

let bumpers = createCube(2, carColor.map(e => e * .4));
bumpers.setSca([0.8, 0.12, 1.55]);
bumpers.setPos([0, -.28, 0]);
kartBase.appendChild(bumpers);


//Rear axle
axleRear = createCylinder(.1, 2, 8, [0.6, 0.6, 0.6]);
axleRear.rotX = Math.PI / 2;
axleRear.rotY = Math.PI / 2;
axleRear.posZ = 1.3;
axleRear.setMaterial({
    diffuse: 0.6,
    specular: 2.0,
    shininess: 50
});

const wheelColor = [0.15, 0.15, 0.15];
wheelRL = createCylinder(.5,.25, 32,wheelColor,"textures/tire_bump.png");
wheelRL.posY = -1;
wheelRL.setMaterial({
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleRear.appendChild(wheelRL);
wheelRR = createCylinder(.5,.25, 32,wheelColor,"textures/tire_bump.png");
wheelRR.posY = 1;
wheelRR.setMaterial({
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleRear.appendChild(wheelRR);

kartBase.appendChild(axleRear);

partL = createCube(0.001);
partR = createCube(0.001);
partL.setPos([1, -1.4, 1]);
partR.setPos([-1, -1.4, 1]);
kartBase.appendChild(partL);
kartBase.appendChild(partR);



partL.appendParticles(new ParticleGenerator(makeParticleGrass, {
    pCount:  20,
    pLifespan: 500,
    pLifespanVariance: .5,
    pVelocity: [0, 1, 6],
    randomDir: .8,
    gravity: [0, -2.5, 0]
}));
partR.appendParticles(new ParticleGenerator(makeParticleGrass, {
    pCount:  20,
    pLifespan: 500,
    pLifespanVariance: .5,
    pVelocity: [0, 1, 6],
    randomDir: .8,
    gravity: [0, -2.5, 0]
}));

//Front axles
axleFR = createCylinder(.1, .8, 8, [0.6, 0.6, 0.6]);
axleFR.rotX = Math.PI / 2;
axleFR.rotY = Math.PI / 2;
axleFR.posZ = -1.1;
axleFR.posX = .5;
axleFR.setMaterial({
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
wheelFR = createCylinder(.5,.25, 32, wheelColor,"textures/tire_bump.png");
wheelFR.posY = .5;
wheelFR.setMaterial({
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleFR.appendChild(wheelFR);

axleFL = createCylinder(.1, .8, 8, wheelColor);
axleFL.rotX = Math.PI / 2;
axleFL.rotY = Math.PI / 2;
axleFL.posZ = -1.1;
axleFL.posX = -.5;
axleFL.setMaterial({
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
wheelFL = createCylinder(.5,.25, 32,wheelColor,"textures/tire_bump.png");
wheelFL.posY = -.5;
wheelFL.setMaterial({
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleFL.appendChild(wheelFL);

kartBase.appendChild(axleFR);
kartBase.appendChild(axleFL);
axleRotY = axleFR.rotY;

//Spoiler
let spoilerColor = [0.1, 0.1, 0.1];
let spoiler = createCube(1, spoilerColor);
spoiler.setMaterial({
    shininess: 128
});
spoiler.setSca([2, 0.01, 0.5]);
spoiler.setPos([0, 0.8, 1.35]);

let spoilerFlapL = createCube(1, spoilerColor);
spoilerFlapL.setMaterial({
    shininess: 128
});
spoilerFlapL.setSca([0.5, 0.01, 0.5]);
spoilerFlapL.setPos([-1.21, 0.73, 1.35]);
spoilerFlapL.setRot([0, 0, 0.3]);

let spoilerFlapR = createCube(1, spoilerColor);
spoilerFlapR.setMaterial({
    shininess: 128
});
spoilerFlapR.setSca([0.5, 0.01, 0.5]);
spoilerFlapR.setPos([1.21, 0.73, 1.35]);
spoilerFlapR.setRot([0, 0, -0.3]);

let spoilerBarL = createCylinder(0.02, 0.5, 8, spoilerColor);
spoilerBarL.setMaterial({shininess:128});
spoilerBarL.setPos([-0.6, .55, 1.35]);
spoilerBarL.setSca([1, 1, 3]);
spoilerBarL.setRot([0.3, 0, 0]);
let spoilerBarR = createCylinder(0.02, 0.5, 8, spoilerColor);
spoilerBarR.setMaterial({shininess:128});
spoilerBarR.setPos([0.6, .55, 1.35]);
spoilerBarR.setSca([1, 1, 3]);
spoilerBarR.setRot([0.3, 0, 0]);


kartBase.appendChild(spoiler);
kartBase.appendChild(spoilerFlapL);
kartBase.appendChild(spoilerFlapR);
kartBase.appendChild(spoilerBarL);
kartBase.appendChild(spoilerBarR);


//Cabin
let windowColor = [.6, 0.98, 0.98].map(e => e * .8); //light blu
let mainCabin = createCube(1, carColor);
mainCabin.setPos([0, .6, .2]);
mainCabin.setSca([1, 0.3, 1]);
mainCabin.setMaterial(carMaterial);

let rearWindow = createCube(1, windowColor);
rearWindow.setPos([0, 0.4, .75]);
rearWindow.setSca([1, 0.3, 0.5]);
rearWindow.setRot([.9, 0, 0]);

kartBase.appendChild(mainCabin);
kartBase.appendChild(rearWindow);

//Rear lights
let lightColor = [1, .6, 0];
let lightRL = createCylinder(0.1, .1, 6, lightColor);
lightRL.setRot([Math.PI / 2, 0, 0]);
lightRL.setPos([-.5, .15, 1.47]);
lightRL.setSca([2, 1, 1]);
kartBase.appendChild(lightRL);
let lightRR = createCylinder(0.1, .1, 6, lightColor);
lightRR.setRot([Math.PI / 2, 0, 0]);
lightRR.setPos([.5, .15, 1.47]);
lightRR.setSca([2, 1, 1]);
kartBase.appendChild(lightRR);
let licPlate = createCube(0.1, [.9, .9, .9]);
licPlate.setRot([Math.PI / 2, 0, 0]);
licPlate.setPos([0, -.05, 1.47]);
licPlate.setSca([4, 2, 1]);
kartBase.appendChild(licPlate);

    //random obstacles
    const obstacleCount = Math.floor(30 + (scale - 1) * 10);
    const obsMinX = -(areaSize / 2);
    const obsMaxX = (areaSize / 2);
    const obsMinZ = -(areaSize / 2);
    const obsMaxZ = (areaSize / 2);
    const obstacleSize = 4;
    const clearSpawnArea = 15;
    for(let i = 0; i < obstacleCount; i++){
        let obs = createCube(1, null,"textures/crate.jpg");
        let posX, posZ;
        do {
            posX = obsMinX + (Math.random() * (obsMaxX- obsMinX));
            posZ = obsMinX + (Math.random() * (obsMaxZ - obsMinZ));
        } while ((posX >= -clearSpawnArea && posX <= clearSpawnArea && posZ >= -clearSpawnArea && posZ <= clearSpawnArea));
        obs.setPos([posX, 1, posZ])
        obs.setSca([obstacleSize, obstacleSize, obstacleSize]);
        obs.setRot([0, Math.random() * Math.PI, 0])
        obs.createCollider(bounceColliders);
        globalObjects.push(obs);
        obstaclePositions.push([posX, posZ]);
    }

    const treeCount = Math.floor(7 + (scale - 1) * 2);
    for(let i = 0; i < treeCount; i++){
        let trunk = createCube(1, [0.4, 0.25, 0.1]);
        trunk.setSca([1, 7, 1]);
        let posX, posZ;
        do {
            posX = obsMinX + (Math.random() * (obsMaxX- obsMinX));
            posZ = obsMinX + (Math.random() * (obsMaxZ - obsMinZ));
        } while ((posX >= -clearSpawnArea && posX <= clearSpawnArea && posZ >= -clearSpawnArea && posZ <= clearSpawnArea));
        trunk.setPos([posX, 1, posZ]);
        trunk.createCollider(bounceColliders);
        globalObjects.push(trunk);
        obstaclePositions.push([posX, posZ]);
        for (let i = 0; i < 8; i++) {
            let c = createSphere(2.3, 5, [0, 0.4, 0.086]);
            c.setMaterial({
                diffuse: 0.9,
                specular: 0.05,
                shininess: 2
            });
            let offsetX = rand(-2, 2);
            let offsetY = rand(0, 2.5);
            let offsetZ = rand(-2, 2);

            c.setPos([
                posX + offsetX,
                1+3.5 + offsetY,
                posZ + offsetZ
            ]);

            globalObjects.push(c);
        }

    }


    /* GROUND */
    const groundMinX = -(areaSize / 2);
    const groundMaxX = (areaSize / 2);
    const groundMinZ = -(areaSize / 2);
    const groundMaxZ = (areaSize / 2);
    const groundPanelSize = 10;
    const groundBrightnessVariance = .05;
    const mudProbability = .05;
    for(let i = groundMinX; i <= groundMaxX; i+=groundPanelSize) {
        for(let j = groundMinZ; j <= groundMaxZ; j+=groundPanelSize){
            let gbv = (Math.random() - 0.5) * groundBrightnessVariance;
            const isMud = Math.random() < mudProbability;
            let floor;
            if(isMud) {
                floor = createPlane(groundPanelSize, groundPanelSize, [0.3 + gbv, 0.2 + gbv, 0.01], "textures/noiseTexture_bump.png");
                floor.createCollider(mudColliders);
                floor.collider.setScale([groundPanelSize / 2, 1, groundPanelSize / 2]);
            }
            else {
                floor = createPlane(groundPanelSize, groundPanelSize, [0.01,0.35 + gbv,0.01], "textures/noiseTexture_bump.png");
            }
            floor.setPos([i, -.5, j]);
            floor.setMaterial({
                diffuse: 0.7,
                specular: 0.2,
                shininess: 4
            });
            globalObjects.push(floor);
        }
    }

    /* ROAD */
    const roadSegments = 40;
    const roadWidth = 15;
    const roadHeight = -.49;
    const circuit = generateRandomCircuit(areaSize, .35, roadSegments);
    const startPosition = circuit[0];
    const startRotation = getAngleBetweenPoints(circuit[0], circuit[1]);
    for(let i = 0; i < circuit.length - 1; i++){
        let coord = circuit[i];
        let coordNext = circuit[i + 1];
        let rsDist = vectorDistance(coordNext, coord);
        let rsAngle = getAngleBetweenPoints(coord, coordNext);
        let rsLength = rsDist * 1.15;
        let rs = createPlane(rsLength, roadWidth, [0.2, 0.2, 0.22], "textures/noiseTexture_bump.png"); 
        rs.setRot([0, -rsAngle, 0]);
        let mid2d = getMidpoint2d(coord, coordNext);
        let midPoint = vectGroundTo3D(mid2d, roadHeight);
        rs.setPos(midPoint);
        globalObjects.push(rs);
        rs.createCollider(roadColliders);
        rs.collider.setScale([rsLength/2, 1, roadWidth/2]);
    }

    /* WALLS */
    const walls = [];
    const wallLength = areaSize;
    const wallHeight = 3;
    for(let i = 0; i < 4; i++){
        let w = createCube(1, [0.459, 0.302, 0.043]);
        w.setSca([1, wallHeight, wallLength]);
        w.setRot([0, (Math.PI/2) * i, 0]);
        let posX = i == 0 ? groundMinX : i == 2 ? groundMaxX : 0;
        let posZ = i == 1 ? groundMinZ : i == 3 ? groundMaxZ : 0;
        w.setPos([posX, (wallHeight / 2 - 1), posZ]);
        w.createCollider(bounceColliders);
        globalObjects.push(w);
    }


    /* BALLS */
    const ballcount = Math.floor(5 + (scale - 1) * 3);
    const ballPadding = 5; //keep the balls from the walls
    for(let i = 0; i < ballcount; i++){
        let posX, posZ;
        do {
            posX = obsMinX + ballPadding + (Math.random() * (obsMaxX - obsMinX - ballPadding));
            posZ = obsMinZ + ballPadding + (Math.random() * (obsMaxZ - obsMinZ - ballPadding));
        } while (!posCheck(posX, posZ));
        let obs = createSphere(1, 32,[.99, .5,.99]);
        obs.setPos([posX, 1.5, posZ])
        obs.setMaterial({ambient: 0.8, diffuse: 0.9, specular: 0.2, shininess: 4});
        obs.yAnimDist = 1;
        obs.yAnimSpeed = 1000;


        obs.createCollider(ballColliders);
        obs.collider.setScale([1.1,2.4,1.1])
        globalObjects.push(obs);
    }

const cloudCount = 100;
const skyBuffer = areaSize * 0.5;
for (let i = 0; i < cloudCount; i++) {

    let cx = (Math.random() * (areaSize + skyBuffer*2)) - (areaSize/2 + skyBuffer);
    let cz = (Math.random() * (areaSize + skyBuffer*2)) - (areaSize/2 + skyBuffer);
    let cy = 20 + Math.random() * 15;
    let cloud = createSphere(1, 5, [1,1,1]);
    cloud.setPos([cx, cy, cz]);
    globalObjects.push(cloud);

    for (let i = 0; i < 15; i++) {
        let c = createSphere(1, 5, [1,1,1]);

        let offsetX = rand(-3, 2);
        let offsetY = rand(0, 1);
        let offsetZ = rand(-3, 2);

        c.setPos([
            cx + offsetX,
            cy + offsetY,
            cz + offsetZ
        ]);

        globalObjects.push(c);
    }
}

    function posCheck(x, z, minDist = 6) {
        for (let [ox, oz] of obstaclePositions) {
            let dx = Math.abs(x - ox);
            let dz = Math.abs(z - oz);
            if (dx < minDist && dz < minDist) {
                return false; 
            }
        }
        return true;
    }

    function rand(min, max) {
    return Math.random() * (max - min) + min;
}
}
