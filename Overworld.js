class Overworld{
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop(){
        const step = ()=>{
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
            
            const cameraPerson = this.map.gameObjects.hero;

            Object.values(this.map.gameObjects).forEach(object =>{
                object.update({
                    arrow:this.directionInput.direction,
                    map: this.map
                });
            });

            this.map.drawLowerImage(this.ctx,cameraPerson);

            Object.values(this.map.gameObjects).sort((a,b)=>{
                return a.y - b.y;
            }).forEach(object =>{
               
                object.sprite.draw(this.ctx,cameraPerson)
            });
            this.map.drawUpperImage(this.ctx,cameraPerson);
            if(!this.map.isPaused){
                requestAnimationFrame(()=>{
                    step();
                })
            }
                   }
        step();
    }
    bindActionInput(){
        new KeyPressListener("Enter",()=>{
            this.map.checkForActionCutscene();
        })

        new KeyPressListener("Escape", ()=>{
            if(!this.map.isPaused){

                this.map.startCutscene([
                    {type:"pause"}
                ])
            }
        })
    }
    bindHeroPositionCheck(){
            document.addEventListener("PersonWalkingCompleat",e=>{
                if(e.detail.whoId==="hero"){
                    this.map.checkForFootstepCutscene();
                }
            })
    }
    startMap(mapConfig){
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this; 
        this.map.mountObjects();
    }
    init(developing){
        this.hud = new Hud();
        this.hud.init(document.querySelector(".game-container"));

        this.startMap(window.OverworldMaps.Demo);

        this.bindActionInput();
        this.bindHeroPositionCheck();
        
        this.directionInput= new DirectionInput();
        this.directionInput.init();
        
        this.startGameLoop();
        
        if(developing){
            // const current = object.behaviorLoop[object.behaviorLoopIndex];
            //         if (current) {
            //             object.doBehaviorEvent(this);
            //         }
            // this.map.startCutscene([
            //     {type:"battle",enemyId:"julia"}
            // ]);
        }
        if(window.initScene!== undefined){
            this.map.startCutscene(window.initScene);
        }
    }
}