var grades = [15, 88]

function assignNewValue(obj){
    obj = [15, 88, 90];
}

function modifyOldArray(obj){
    obj.push(99);
}

assignNewValue(grades);
console.log("Assign: " + grades);


modifyOldArray(grades);
console.log("Modify: " + grades);