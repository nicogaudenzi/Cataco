window.Actions = {
  damage1: {
    name: "Tortilla aguada",
    description:"Quita un poco de SABOR del enemigo",
    success: [
      { type: "textMessage", text: "{CASTER} usó {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10}
    ]
  },
  saucyStatus: {
    name: "Salsa",
    targetType:"friendly",
    description:"Regresa un poco de SABOR cada turno",
    success: [
      { type: "textMessage", text: "{CASTER} usó {ACTION}!"},
      { type: "stateChange", status:{type:"enchilado",expiresIn:2}},
    ]
  },
  clumsyStatus: {
    name: "Aceite de carnitas",
    description:"Pone en estado grasoso al enemigo",
    success: [
      { type: "textMessage", text: "{CASTER} usó {ACTION}!"},
      { type: "animation",animation:"glob",color:"#dafd2a"},
      { type: "stateChange", status:{type:"grasoso",expiresIn:2}},
      { type: "textMessage", text: "{TARGET} tiene extra aceite."},
    ]
  },
  //Items
  item_recoverStatus: {
    name: "Sal en la lengua",
    description: "Ayuda a aliviar molestias",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} usa {ACTION}!"},
      { type: "stateChange", status: null },
      { type: "textMessage", text: "{CASTER} ya no sufre efectos secunarios", },
    ]
  },
  item_recoverHp: {
    name: "Rabano",
    description: "Recupera un poco del contraste en el sabor",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} combina {ACTION} en su taco.", },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: "{CASTER} recupera SABOR.", },
    ]
  },
}