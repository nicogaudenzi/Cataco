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
    });
    return builtOverworld;
}

(async function () {
    // let decodedCookie = document.cookie;
    // console.log(the_cookie.maps);
    // if(the_cookie.maps==="" || the_cookie.maps=== undefined){
    //      }else{
    //      }
    let imDeveloping= true;
    let the_cookie = getCookiesMap(document.cookie);

    if(imDeveloping){
        window.OverworldMaps = buildOverworldFromSheets(JSON.parse(the_cookie.maps));
    }else{
        console.log("Requesting...");    

        let r = await requestContent();
        window.OverworldMaps= buildOverworldFromSheets(r);
        window.initScene = r.initScene;
        document.cookie = "maps="+JSON.stringify(r)+"; expires="+ (new Date()).toDateString();
    }
    const overworld = new Overworld({element: document.querySelector(".game-container")});
    overworld.init(imDeveloping);
})();