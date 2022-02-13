class GameObject{
    constructor(config){
        this.id=null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src:config.src||"/images/characters/people/Char.png",
        });
        this.behaviorLoop = config.behaviorLoop||[];
        this.behaviorLoopIndex = 0;
        this.talking = config.talking||[];
    }
    mount(map){
        map.addWall(this.x,this.y);
            setTimeout(()=>{
                this.doBehaviorEvent(map);
            },10);
        this.isMounted = true;
    }

    update(){
        //Person class inherits from this
    }
    async doBehaviorEvent(map){
        if(this.behaviorLoop[this.behaviorLoopIndex]===undefined)return;
        if(map.isCutscenePlaying || this.behaviorLoop.length ===0||this.isStanding) {
            console.log("CutScenePlaying or something")
            return;
        }

        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        const eventHandler = new OverworldEvent({map,event:eventConfig});
        await eventHandler.init();

        this.behaviorLoopIndex+=1;
        if(this.behaviorLoopIndex===this.behaviorLoop.length){
            this.behaviorLoopIndex = 0;
        }

        this.doBehaviorEvent(map);

    }
}