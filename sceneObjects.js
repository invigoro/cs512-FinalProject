const globalObjects = [];

/* VEHICLE */
let kartBase = createCube(.1);

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
let wheelRL = createCylinder(.5,.25, 32, [0.15, 0.15, 0.15]);
wheelRL.posY = -1;
wheelRL.setMaterial({
    ambient: 0.2,
    diffuse: 1.0,
    specular: 0.1,
    shininess: 8
});
axleRear.appendChild(wheelRL);
let wheelRR = createCylinder(.5,.25, 32, [0.15, 0.15, 0.15]);
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
let wheelFR = createCylinder(.5,.25, 32, [0.15, 0.15, 0.15]);
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
let wheelFL = createCylinder(.5,.25, 32, [0.15, 0.15, 0.15]);
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
let cube1 = createCube(4);
cube1.setPos([-1, 1, -10]);
cube1.setRot([0, 1, 0]);
globalObjects.push(cube1);

let cube2 = createCube(2);
cube2.setPos([0, 1, 0]);
cube2.setSca([1, 5, 1]);
cube2.setRot([1, 0, 0]);
cube1.appendChild(cube2);

//random obstacles
const obstacleCount = 20;
const xMin = -5; const xMax = -100;
const zMin = -5; const zMax = -100;

for(let i = 0; i < obstacleCount; i++){
    let obs = createCube(4);
    posX = xMin + (Math.random() * (xMax - xMin));
    posZ = zMin + (Math.random() * (zMax - zMin));
    obs.setPos([posX, 1, posZ])
    obs.setRot([0, Math.random() * Math.PI, 0])
    globalObjects.push(obs);
}