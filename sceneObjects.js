const globalObjects = [];

/* VEHICLE */
let kartBase = createCube(.1);

let chassis = createCube(2, [0.9, .02, 0.03]);
chassis.scaY = 0.3;
chassis.scaX = .75;
chassis.scaZ = 1.5;
kartBase.appendChild(chassis);

//Rear axle
let axleRear = createCylinder(.1, 2, 8, [0.3, 0.3, 0.3]);
axleRear.rotX = Math.PI / 2;
axleRear.rotY = Math.PI / 2;
axleRear.posZ = 1.3;
let wheelRL = createCylinder(.5,.25, 32, [0.15, 0.15, 0.15]);
wheelRL.posY = -1;
axleRear.appendChild(wheelRL);
let wheelRR = createCylinder(.5,.25, 32, [0.15, 0.15, 0.15]);
wheelRR.posY = 1;
axleRear.appendChild(wheelRR);

kartBase.appendChild(axleRear);

//Front axle
let axleFR = createCylinder(.1, .8, 8, [0.3, 0.3, 0.3]);
axleFR.rotX = Math.PI / 2;
axleFR.rotY = Math.PI / 2;
axleFR.posZ = -1.1;
axleFR.posX = .5;
let wheelFR = createCylinder(.5,.25, 32, [0.15, 0.15, 0.15]);
wheelFR.posY = .5;
axleFR.appendChild(wheelFR);

let axleFL = createCylinder(.1, .8, 8, [0.3, 0.3, 0.3]);
axleFL.rotX = Math.PI / 2;
axleFL.rotY = Math.PI / 2;
axleFL.posZ = -1.1;
axleFL.posX = -.5;
let wheelFL = createCylinder(.5,.25, 32, [0.15, 0.15, 0.15]);
wheelFL.posY = -.5;
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