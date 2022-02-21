function getCookiesMap(cookiesString) {
    return cookiesString.split(";")
      .map(function(cookieString) {
          return cookieString.trim().split("=");
      })
      .reduce(function(acc, curr) {
          acc[curr[0]] = curr[1];
          return acc;
      }, {});
  }

function buildOverworldFromSheets(r){
    let builtOverworld={}
    Object.keys(r.rooms).forEach((room)=>{
        builtOverworld[room] = {
            lowerSrc : r.rooms[room].lowerSrc,
            upperSrc : r.rooms[room].upperSrc,
            walls : r.rooms[room].walls,

            gameObjects : {},
            cutSceneSpaces : r.rooms[room].cutSceneSpaces
        }
        Object.keys(r.rooms[room].gameObjects).forEach(gameobject=>{
            builtOverworld[room].gameObjects[gameobject]=new Person(r.rooms[room].gameObjects[gameobject]); 
            builtOverworld[room].gameObjects[gameobject].id = gameobject;
        });
        if(r.rooms[room].pizzaStone.length>0){
            console.log(r.rooms[room].pizzaStone.length)
            let index = 0;
        r.rooms[room].pizzaStone.forEach(comal=>{
            builtOverworld[room].gameObjects["pizzaStone"+index]=new PizzaStone(comal);
            index+=1;
        })
    }
    });
    console.log(builtOverworld);

    return builtOverworld;
}

(async function () {
    // let decodedCookie = document.cookie;
    // console.log(the_cookie.maps);
    // if(the_cookie.maps==="" || the_cookie.maps=== undefined){
    //      }else{
    //      }
    let imDeveloping= false;
    if(imDeveloping){
        let the_cookie = localStorage.getItem('maps');
        let r = JSON.parse(the_cookie);
        window.OverworldMaps = buildOverworldFromSheets(r);
        window.localizationDict = r.localizationDict;

    }else{
        console.log("Requesting...");    
        let r = await requestContent();
        window.OverworldMaps= buildOverworldFromSheets(r);
        window.localizationDict = r.localizationDict;

       // window.initScene = r.initScene;
        localStorage.setItem('maps',JSON.stringify(r));
    }
    
    const overworld = new Overworld({element: document.querySelector(".game-container")});
    overworld.init(imDeveloping);
})();