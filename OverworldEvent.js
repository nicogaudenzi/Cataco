class OverworldEvent{
    constructor({map,event}){
        this.map = map;
        this.event = event;
    }

    stand(resolve){
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map:this.map
        },{
            type:"stand",
            direction:this.event.direction,
            time: this.event.time
        });
        const compleatEventHandler = e => {
        if(e.detail.whoId=== this.event.who){

            document.removeEventListener("PersonStandCompleat",compleatEventHandler)
            resolve();
             }
        }
        document.addEventListener("PersonStandCompleat",compleatEventHandler)
    }
    walk(resolve){
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map:this.map
        },{
            type:"walk",
            direction:this.event.direction,
            retry:true
        });
        const compleatEventHandler = e => {
        if(e.detail.whoId=== this.event.who){

            document.removeEventListener("PersonWalkingCompleat",compleatEventHandler)
            resolve();
             }
        }
        document.addEventListener("PersonWalkingCompleat",compleatEventHandler)
    }
    textMessage(resolve){
        if(this.event.faceHero){
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }
        const message = new TextMessage({
            text: window.localizationDict[this.event.text],
            onComplete: ()=>resolve()
        })
        message.init(document.querySelector(".game-container"))
    }
    changeMap(resolve){
        const sceneTransition = new SceneTransition();

        sceneTransition.init(document.querySelector(".game-container"),()=>{
            this.map.overworld.startMap(window.OverworldMaps[this.event.map],{
                x:utils.withGrid(this.event.heroX),
                y:utils.withGrid(this.event.heroY),
                direction: this.event.direction
            });
            resolve();
            sceneTransition.fadeOut();
        });
       
    }
    battle(resolve){
        const battle= new Battle({
            enemy: Enemies[this.event.enemyId],
            onComplete:(didWin)=>{
                this.map.isCutscenePlaying = false;

                Object.values(this.map.gameObjects).forEach(object=>{
                const current = object.behaviorLoop[object.behaviorLoopIndex];
                if (current&&!object.retrying) {
                    object.doBehaviorEvent(this.map);
                    }
                })
                resolve(didWin?"WON_BATTLE":"LOST_BATTLE");
            }
        })
        battle.init(document.querySelector(".game-container"));
    }
    pause(resolve){
        this.map.isPaused = true;
        const menu = new PauseMenu({
            progress:this.map.overworld.progress,
            onComplete: ()=>{
                resolve();
                this.map.isPaused=false;
                this.map.overworld.startGameLoop();
            }
        });     

        menu.init(document.querySelector(".game-container"));
    }
    addStoryFlag(resolve) {
        window.playerState.storyFlags[this.event.flag] = true;
        resolve();
      }
      craftingMenu(resolve) {
        const menu = new CraftingMenu({
          pizzas: this.event.pizzas,
          onComplete: () => {
            resolve();
          }
        })
        menu.init(document.querySelector(".game-container"))
      }
    init(){
        return new Promise(resolve=>{
            this[this.event.type](resolve);
        })
    }
}