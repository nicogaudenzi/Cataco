class OverworldMap{
    constructor(config){
        this.overworld = null;
        this.walls=config.walls||{};
        this.gameObjects = config.gameObjects;
        this.cutSceneSpaces = config.cutSceneSpaces||{};
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
        this.isCutscenePlaying = false;
    }
        drawLowerImage(ctx,cameraPerson){
            ctx.drawImage(this.lowerImage,utils.withGrid(10.5)-cameraPerson.x,utils.withGrid(6)-cameraPerson.y);
        }
        drawUpperImage(ctx,cameraPerson){
            ctx.drawImage(this.upperImage,utils.withGrid(10.5)-cameraPerson.x,utils.withGrid(6)-cameraPerson.y);
        }
        isSpaceTaken(currentX,currentY,direction){
            const {x,y}=utils.nextPosition(currentX,currentY,direction);
            return this.walls[`${x},${y}`]||false;
        }
        mountObjects(){
            Object.keys(this.gameObjects).forEach(key=>{
                let object = this.gameObjects[key];
                object.id = key;
                object.mount(this);
            })
        }

        async startCutscene(events){
            
            this.isCutscenePlaying = true;
            for(let i = 0;i<events.length;i++){
                
                const eventHandler = new OverworldEvent({
                    event:events[i],
                    map:this,
                })
                await eventHandler.init();
            }
            this.isCutscenePlaying = false;

                Object.values(this.gameObjects).forEach(object=>{
                    if(object.retrying)return;
                    const current = object.behaviorLoop[object.behaviorLoopIndex];
                    if (current && current.type === "stand") {
                        if (object.retrying) return
                        object.doBehaviorEvent(this);
                    }
                });
        }
        checkForActionCutscene(){
            const hero = this.gameObjects["hero"];
            const nextCoords = utils.nextPosition(hero.x,hero.y,hero.direction);
            const match = Object.values(this.gameObjects).find(object=>{
                return `${object.x},${object.y}`=== `${nextCoords.x},${nextCoords.y}`;
            });

            if (!this.isCutscenePlaying && match && match.talking.length){
                this.startCutscene(match.talking[0].events)
            }
        }
        checkForFootstepCutscene(){
            const hero = this.gameObjects["hero"];
            const match = this.cutSceneSpaces[`${hero.x},${hero.y}`];
            if(!this.isCutscenePlaying && match ){
                this.isCutscenePlaying=true;
                this.startCutscene(match[0].events);
            }
        }
        addWall(x,y){
            this.walls[`${x},${y}`]=true; 
        }
        removeWall(x,y){
            delete this.walls[`${x},${y}`]
        }
        moveWall(wasX,wasY,direction){
            this.removeWall(wasX,wasY);
            const {x,y} = utils.nextPosition(wasX,wasY,direction);
            this.addWall(x,y);
        }
}

// window.OverworldMapsDev = {
//     Demo:{
//         lowerSrc:"/images/maps/DemoLower.png",
//         upperSrc:"/images/maps/DemoUpper.png",
//         gameObjects:{
//             hero:new Person({
//                 x:utils.withGrid(5),
//                 y:utils.withGrid(6),
//                 isPlayerControlled:true
//             }),
//             npc1:new Person({
//                 x:utils.withGrid(7),
//                 y:utils.withGrid(9),
//                 src:"/images/characters/people/npc1.png",
//                 behaviorLoop:[
//                     {type:"stand",direction:"left",time:800}, 
//                     {type:"stand",direction:"up",time:800},
//                     {type:"stand",direction:"right",time:1200},
//                     {type:"stand",direction:"up",time:300},
//                 ],
//                 talking:[
//                     {
//                     events:[
//                         {type:"textMessage",text:"Hola amigo!",faceHero:"npc1"},
//                         {type:"textMessage",text:"¿Que haces por aca?"}
//                     ]
//                 }
//                 ]
//             }),
//             npc2:new Person({
//                 x:utils.withGrid(8),
//                 y:utils.withGrid(5),
//                 src:"/images/characters/people/npc2.png",
//                 talking:[
//                     {
//                     events:[
//                         {type:"textMessage",text:"Solo estóy aquí para asegurarme que nadie intente salir por el armario",faceHero:"npc2"},
//                         {who:"npc2",type:"stand",direction:"down",time:100}
//                     ]
//                 }
//                 ]
//             }),
        
//         },
//         walls:{
//             [utils.asGridCoord(7,6)]:true,
//             [utils.asGridCoord(8,6)]:true, 
//             [utils.asGridCoord(7,7)]:true,
//             [utils.asGridCoord(8,7)]:true,
//             [utils.asGridCoord(4,4)]:true,
//             [utils.asGridCoord(3,4)]:true,
//             [utils.asGridCoord(1,3)]:true,
//             [utils.asGridCoord(2,3)]:true,
//             [utils.asGridCoord(5,3)]:true,
//             [utils.asGridCoord(7,3)]:true,
//             [utils.asGridCoord(9,3)]:true,
//             [utils.asGridCoord(10,3)]:true,
//             [utils.asGridCoord(8,4)]:true,
//             [utils.asGridCoord(6,4)]:true,
//             [utils.asGridCoord(0,4)]:true,
//             [utils.asGridCoord(0,5)]:true,
//             [utils.asGridCoord(0,6)]:true,
//             [utils.asGridCoord(0,7)]:true,
//             [utils.asGridCoord(0,8)]:true,
//             [utils.asGridCoord(0,9)]:true,
//             [utils.asGridCoord(1,10)]:true,
//             [utils.asGridCoord(2,10)]:true,
//             [utils.asGridCoord(3,10)]:true,
//             [utils.asGridCoord(4,10)]:true,
//             [utils.asGridCoord(5,11)]:true,
//             [utils.asGridCoord(6,10)]:true,
//             [utils.asGridCoord(7,10)]:true,
//             [utils.asGridCoord(8,10)]:true,
//             [utils.asGridCoord(9,10)]:true,
//             [utils.asGridCoord(10,10)]:true,
//             [utils.asGridCoord(11,9)]:true,
//             [utils.asGridCoord(11,8)]:true,
//             [utils.asGridCoord(11,7)]:true,
//             [utils.asGridCoord(11,6)]:true,
//             [utils.asGridCoord(11,5)]:true,
//             [utils.asGridCoord(11,4)]:true,
//         },
//         cutSceneSpaces:{
//             [utils.asGridCoord(7,4)] :[
//                 {
//                     events:[
//                         {who:"npc2",type:"walk",direction:"left"},
//                         {who: "npc2",type:"stand",direction:"up",time:100},
//                         {type:"textMessage",text:"Hey...La salida no es por el armario"},
//                         {who:"npc2",type:"walk",direction:"right"},
//                         {who:"npc2",type:"stand",direction:"left",time:100},
//                         {who:"hero",type:"walk",direction:"down"},
//                         {who:"npc2",type:"stand",direction:"down",time:100}

//                     ]
//                 }
//             ],
//             [utils.asGridCoord(5,10)]:[
//                 {
//                     events:[
//                         {type:"changeMap",map:"Kitchen"}
//                     ]
//                 }
//             ]
//         },

//     },
//     Kitchen:{
//         lowerSrc:"/images/maps/KitchenLower.png",
//         upperSrc:"/images/maps/KitchenUpper.png",
//         gameObjects:{
//             hero:new Person({
//                 isPlayerControlled:true,
//                 x:utils.withGrid(5),
//                 y:utils.withGrid(6)
//             }),
//             npc3:new Person({
//                 x:utils.withGrid(7),
//                 y:utils.withGrid(5),
//                 src:"/images/characters/people/npc3.png",
//                 talking:[
//                     {
//                         events:[
//                             {type:"textMessage", text:"¡Lograste cambiar de cuarto!", faceHero:"npc3"}
//                     ]
//                 }
//             ]
//             })
//         }
//     },
    
// }