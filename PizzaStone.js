class PizzaStone extends GameObject {
  constructor(config) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      src: "/Cataco/images/characters/pizza-stone.png",
      animations: {
        "used-down"   : [ [0,0] ],
        "unused-down" : [ [1,0] ],
      },
      currentAnimation: "used-down"
    });
    this.storyFlag = config.storyFlag;
    this.pizzas = config.pizzas;

    this.talking = [
      {
        requires: [this.storyFlag],
        events: [
          { type: "textMessage", text: "comal_usado" },
        ]
      },
      {
        events: [
          { type: "textMessage", text: "comal_sin_usar" },
          { type: "craftingMenu", pizzas: this.pizzas },
          { type: "addStoryFlag", flag: this.storyFlag },
        ]
      }
    ]

  }

  update() {
   this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
    ? "used-down"
    : "unused-down";
  }

}