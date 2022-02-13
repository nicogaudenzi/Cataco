const utils = {
  withGrid(n) {
    return n * 16;
  },
  asGridCoord(x,y){
    return `${x*16},${y*16}`
  },
  nextPosition(initX,initY, direction){
    let x = initX;
    let y = initY;
    const size = 16;
    if(direction==="left"){
      x-= size;
    }
    if(direction==="right"){
      x+= size;
    }
    if(direction==="up"){
      y-= size;
    }
    if(direction==="down"){
      y+= size;
    }
    return {x,y}
  },
  emitEvent(name,detail){
    const event = new CustomEvent(name,{detail});
    document.dispatchEvent(event);
  },
  oppositeDirection(direction) {
    if (direction === "left") { return "right" }
    if (direction === "right") { return "left" }
    if (direction === "up") { return "down" }
    return "up"
  },
  wait(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  },
}