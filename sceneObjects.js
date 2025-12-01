const globalObjects = [];

//Vehicle
let kartBase = createCube(2);
kartBase.scaY = 1;
//globalObjects.push(kartBase);

//Obstacles
let cube2 = createCube(4);
cube2.setPos([-1, 1, -10]);
globalObjects.push(cube2);
