class TurnCycle {
  constructor({ battle, onNewEvent,onWinner }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
    this.currentTeam = "player"; //or "enemy"
  }

  async turn() {
    //Get the caster
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"]
    const enemy = this.battle.combatants[enemyId];

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy
    });

    if(submission.replacement){
      await this.onNewEvent({
        type:"replace",
        replacement:submission.replacement
      })
      await this.onNewEvent({
        type:"textMessage",
        text:`Ve por ellos ${submission.replacement.name}`
      })
      this.nextTurn();
      return;
    }

    if(submission.instanceId){
      this.battle.usedInstanceIds[submission.instanceId]=true
      this.battle.items = this.battle.items.filter(i=>i.instanceId!==submission.instanceId);

    }
    const resultingEvents = caster.getReplacedEvents(submission.action.success);
    
    for (let i=0; i<resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      }
      await this.onNewEvent(event);
    }

    const targetDead = submission.target.hp<=0;
    if(targetDead){
      await this.onNewEvent({
        type:"textMessage", text: `${submission.target.name} está acabado`
      })
      if(submission.target.team ==="enemy"){
      const playerActivePizzaId= this.battle.activeCombatants.player;
      const xp = submission.target.givesXP;
      await this.onNewEvent({
        type:"textMessage",
        text: `Ganaste ${xp} de experiencia. Te estas haciendo mejor taquero`
      })  
      await this.onNewEvent({
        type:"giveXP",
        xp,
        combatant:this.battle.combatants[playerActivePizzaId]
      })
    }
    }
    
    const winner = this.getWinningTeam();
    if(winner){
      await this.onNewEvent({
        type:"textMessage",
        text:"Tenemos alguien victorioso"
      })
     this.onWinner(winner);
     return; 
    }

    if(targetDead){
     const replacement = await this.onNewEvent({
       type: "replacementMenu",
       team: submission.target.team
     })
     await this.onNewEvent({
       type:"replace",
       replacement: replacement
     })
     await this.onNewEvent({
       type:"textMessage",
       text:`Llega en su lugar ${replacement.name}`
     })

    }

    const postEvents = caster.getPostEvents();
    for (let i = 0;i<postEvents.length;i++){
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target:submission.target
      }
      await this.onNewEvent(event);
    }

    const expiredEvent = caster.decrementStatus();
    if(expiredEvent){
      await this.onNewEvent(expiredEvent);
    }

    
    this.nextTurn();
  }

  nextTurn(){
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn();
  }
  getWinningTeam(){
    let aliveTeams= {}
    Object.values(this.battle.combatants).forEach(c=>{
      if(c.hp>0){
        aliveTeams[c.team] = true;
      }
    })
    if(!aliveTeams["player"]){return "enemy"}
    if(!aliveTeams["enemy"]){return "player"}
    return null;
  }
  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `${this.battle.enemy.name} está list@ para la batalla`
    })

    //Start the first turn!
    this.turn();

  }

}