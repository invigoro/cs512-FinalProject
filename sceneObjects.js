const globalObjects = [];

//Vehicle
let kartBase = createCube(2);
kartBase.scaY = 1;

//Obstacles
let cube1 = createCube(4);
cube1.setPos([-1, 1, -10]);
cube1.setRot([0, 1, 0]);
globalObjects.push(cube1);

let cube2 = createCube(2);
cube2.setPos([0, 1, 0]);
cube2.setSca([1, 5, 1]);
cube2.setRot([1, 0, 0]);
cube1.appendChild(cube2);