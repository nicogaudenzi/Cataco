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
            text: this.event.text,
            onComplete: ()=>resolve()
        })
        message.init(document.querySelector(".game-container"))
    }
    changeMap(resolve){
        const sceneTransition = new SceneTransition();

        sceneTransition.init(document.querySelector(".game-container"),()=>{
            this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
            //this.map.overworld.bindHeroPositionCheck();
            resolve();
            sceneTransition.fadeOut();
        });
       
    }
    battle(resolve){
        const battle= new Battle({
            onComplete:()=>{
                resolve();
            }
        })
        battle.init(document.querySelector(".game-container"));
    }
    init(){
        return new Promise(resolve=>{
            this[this.event.type](resolve);
        })
    }
}