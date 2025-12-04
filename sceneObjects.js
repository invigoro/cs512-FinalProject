const globalObjects = [];
const globalColliders = [];
const ballColliders = [];
const obstaclePositions = [];

/* VEHICLE */
let kartBase = createCube(.1);
kartBase.createCollider(false);
kartBase.collider.setScale([1.2,0.5,1.45]); 

let carColor = [0.9, .02, 0.03];
let carMaterial = 
{
    ambient: 0.4,
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
};
let chassis = createCube(2, [0.9, .02, 0.03]);
chassis.scaY = 0.3;
chassis.scaX = .75;
chassis.scaZ = 1.5;
chassis.setMaterial(carMaterial);
kartBase.appendChild(chassis);

//Rear axle
let axleRear = createCylinder(.1, 2, 8, [0.6, 0.6, 0.6]);
axleRear.rotX = Math.PI / 2;
axleRear.rotY = Math.PI / 2;
axleRear.posZ = 1.3;
axleRear.setMaterial({
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
let wheelRL = createCylinder(.5,.25, 32, [0.35, 0.35, 0.35],"textures/tire.png");
wheelRL.posY = -1;
wheelRL.setMaterial({
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleRear.appendChild(wheelRL);
let wheelRR = createCylinder(.5,.25, 32, [0.35, 0.35, 0.35],"textures/tire.png");
wheelRR.posY = 1;
wheelRR.setMaterial({
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
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
let wheelFR = createCylinder(.5,.25, 32, [0.35, 0.35, 0.35],"textures/tire.png");
wheelFR.posY = .5;
wheelFR.setMaterial({
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
    diffuse: 0.6,
    specular: 2.0,
    shininess: 128
});
let wheelFL = createCylinder(.5,.25, 32, [0.35, 0.35, 0.35],"textures/tire.png");
wheelFL.posY = -.5;
wheelFL.setMaterial({
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleFL.appendChild(wheelFL);

kartBase.appendChild(axleFR);
kartBase.appendChild(axleFL);

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
let windowColor = [.6, 0.98, 0.98]; //light blu
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

function createScene(scale = 1) {
    globalObjects.length = 0;
    globalColliders.length = 0;
    ballColliders.length = 0;
    obstaclePositions.length = 0;
    const areaSize = 250;

    //random obstacles
    const obstacleCount = Math.floor(30 + (scale - 1) * 10);
    const obsMinX = -(areaSize / 2);
    const obsMaxX = (areaSize / 2);
    const obsMinZ = -(areaSize / 2);
    const obsMaxZ = (areaSize / 2);
    const obstacleSize = 4;

    for(let i = 0; i < obstacleCount; i++){
        let obs = createCube(1, null,"textures/crate.jpg");
        let posX, posZ;
        do {
            posX = obsMinX + (Math.random() * (obsMaxX- obsMinX));
            posZ = obsMinX + (Math.random() * (obsMaxZ - obsMinZ));
        } while ((posX >= -4 && posX <= 4 && posZ >= -4 && posZ <= 4));
        obs.setPos([posX, 1, posZ])
        obs.setSca([obstacleSize, obstacleSize, obstacleSize]);
        obs.setRot([0, Math.random() * Math.PI, 0])
        obs.createCollider(true);
        globalObjects.push(obs);
        obstaclePositions.push([posX, posZ]);
    }

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
        let rs = createPlane(rsDist * 1.1, roadWidth, [0.2, 0.2, 0.22], "textures/noiseTexture_bump.png"); 
        rs.setRot([0, -rsAngle, 0]);
        let mid2d = getMidpoint2d(coord, coordNext);
        let midPoint = vectGroundTo3D(mid2d, roadHeight);
        rs.setPos(midPoint);
        globalObjects.push(rs);
    }
    console.log(circuit);

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
        w.createCollider(true);
        globalObjects.push(w);
    }


    /* BALLS */
    const ballcount = Math.floor(5 + (scale - 1) * 3);
    for(let i = 0; i < ballcount; i++){
        let posX, posZ;
        do {
            posX = obsMinX + (Math.random() * (obsMaxX - obsMinX));
            posZ = obsMinZ + (Math.random() * (obsMaxZ - obsMinZ));
        } while (!posCheck(posX, posZ));
        let obs = createSphere(1, 32,[1,1,1]);
        obs.setPos([posX, 1, posZ])
        obs.setMaterial({ambient: 0.8, diffuse: 0.9, specular: 0.2, shininess: 4});


        obs.createCollider(true,true);
        globalObjects.push(obs);
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
}
