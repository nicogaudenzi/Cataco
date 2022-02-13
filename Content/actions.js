window.Actions = {
  damage1: {
    name: "Whomp!",
    success: [
      { type: "textMessage", text: "{CASTER} usó {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10}
    ]
  }
}