let doc ={}
function setup(){
  doc = SpreadsheetApp.openById("1rPsk6bHhK-qU7V3l0g3FBhfqvDujSMn7NgimbZdD7DI");
  }
function test(){
  setup()
  let a = getLanguage("en");
  let talking = getTalking(a)
  Logger.log(talking);
}

function doGet(e) {
    setup();
  Logger.log(e);

   if(e.parameter.langOnly){
      
      return  ContentService.createTextOutput(JSON.stringify({"content":getLanguage(e.parameter.lang)})).setMimeType(ContentService. MimeType.JSON);
    }
   const lang = e.parameter.lang?e.parameter.lang:"es"
   let response = work(lang);
    return ContentService.createTextOutput(JSON.stringify({"content":response})).setMimeType(ContentService. MimeType.JSON);

}
function work(lang){

  let mapSkinsDict = getMapSkinDict();
  let charSkinsDict = getCharDict();
  let lenguageDict = getLanguage(lang);
  let behaviors = getBehaviorLoops();
  let talking = getTalking();
  let locatedLoops = getLoops("LocatedLoops");
  let sceneLoops = getLoops("SceneLoops");
  let gameObjects = getLoops("gameObjects");
  let walls = getWalls();
  let overWorldMaps = getMapStructure(walls,locatedLoops,mapSkinsDict,gameObjects,behaviors,talking,charSkinsDict);
  let res={"rooms":overWorldMaps,"initScene":sceneLoops["init"],"localizationDict":lenguageDict}
  return res;
    
}

function getMapStructure(walls,locatedLoops,mapSkinsDict,gameObjects,behaviors,talking,charSkinsDict){
  const mapRows = getRows("Maps",13);
  let overWorldMaps = {}
  let currentMap ="";
  let currentGameObject="";

  let map ={};
  for(let i =1;i< mapRows.length;i++){
    let row = mapRows[i];
    if(row[0]!==""){
      currentMap = row[0];
      map ={};
     
      map["upperSrc"]=mapSkinsDict[row[1]];
       map["lowerSrc"]=mapSkinsDict[row[2]];
     
      map["gameObjects"]={};
      map["walls"]=walls[row[3]];    
      map["cutSceneSpaces"]={};
    }
    if(row[4]!==""){
      let loop = locatedLoops[row[4]][0];
      if(map["cutSceneSpaces"][asGridCoord(loop["x"],loop["y"])]===undefined){
        map["cutSceneSpaces"][asGridCoord(loop["x"],loop["y"])]=[];
      }
      map["cutSceneSpaces"][asGridCoord(loop["x"],loop["y"])].push({"events":locatedLoops[row[4]]});
    }
    if(row[6]!==""){
      currentGameObject = row[6];
      let src = gameObjects[currentGameObject];
      map["gameObjects"][currentGameObject]={"x":withGrid(row[7]),"y":withGrid(row[8]),"src":charSkinsDict[gameObjects[currentGameObject][0]["src"]]};
      map["gameObjects"][currentGameObject]["behaviorLoop"]=[];
      map["gameObjects"][currentGameObject]["talking"]=[];
      map["gameObjects"][currentGameObject]["useShadow"]= gameObjects[currentGameObject][0]["useShadow"];
    }
    if(row[9]===true){
      map["gameObjects"][currentGameObject]["isPlayerControlled"]=true;
    }
    if(row[10]!==""){
      map["gameObjects"][currentGameObject]["behaviorLoop"]=behaviors[row[10]];
    }
    if(row[11]!==""){
      map["gameObjects"][currentGameObject]["talking"].push(talking[row[11]][0]);
    }
    overWorldMaps[currentMap]=map;
  }
  return overWorldMaps;
}
function getWalls(){
  const rows = getRows("Walls",22);
  let wallDict = {}
  let currentRoom=""
  let currentRow = 0;
  for(let j=1;j<rows.length;j++){
    for(let i = 0;i<rows[j].length;i++){
      if(rows[j][0]!==""){
        currentRow = j;
        currentRoom = rows[j][0];
        wallDict[currentRoom]={};
      }

      if(rows[j][i]==="x"){
        wallDict[currentRoom][asGridCoord(i-1,j-currentRow)]=true;
      }
    }
  }
  return wallDict;
}
function getLoops(sheetName){
  const rows = getRows(sheetName);
  let currentTalk = "";
  let talking={}

  for(let j=1;j<rows.length;j++){
    if(rows[j][0]!==""){
      currentTalk = rows[j][0];
      talks = [];
    }
    let message = {}
    for(let i = 1;i<rows[j].length;i++){
      if(rows[j][i]!=="")
      message[rows[0][i]]=rows[j][i];
    }
    talks.push(message);
    talking[currentTalk]=talks;
  }
  return talking;
}
function getCharDict(){
  let charDict = {}
  const sheet = doc.getSheetByName("config");
  const lastRow = sheet.getLastRow();
  var range = sheet.getRange(1,4,lastRow,2);
  var values=range.getValues();
  for(let i=1;i< values.length;i++){
    for(let col in values[i]){
      if(values[i][col]!=="")
        charDict[values[i][0]]=values[i][col];
    }
  }
  return charDict;
}
function getMapSkinDict(){
  let mapDict = {}
  const sheet = doc.getSheetByName("config");
  const lastRow = sheet.getLastRow();

  var range = sheet.getRange(1,1,lastRow,2);
  var values=range.getValues();
  for(let i=1;i< values.length;i++){
    for(let col in values[i]){
      if(values[i][col]!=="")
        mapDict[values[i][0]]=values[i][col];
    }
  }
  return mapDict;
}

function getTalking(){
  const rows = getRows("Talking");
  let currentTalk = "";
  let talking={}
  let talks=[]
  for(let j=1;j<rows.length;j++){
    if(rows[j][0]!==""){
      talks=[]
      currentTalk = rows[j][0];
      talks.push({"required":[],"events":[]});
    }
    let message = {}
    for(let i = 1;i<rows[j].length;i++){
      if(rows[j][i]!==""&&i!==5){
        message[rows[0][i]]=rows[j][i];
      }
      
    }
    if(rows[j][5]!==""){
        const list = rows[j][5].split(",");
        talks[0]["required"] = list;
      }
    talks[0]["events"].push(message);
    talking[currentTalk]=talks;
  }
  
  return talking
}
function getLanguage(e){
  const sheet = doc.getSheetByName("TextLocalization");
  var data = sheet.getDataRange().getValues();
  var col = data[0].findIndex((name) => name === e) ;

  let lenguage = "es";
  let talkingDict = {};
  
//  var col = data[0].indexOf(lenguage);

  for(let i=1;i<data.length;i++){
    if (col != -1) {
      const key = data[i][0];
      talkingDict[key]=data[i][col];
    }
  }
return talkingDict;
}

function getRows(sheetName){
  let rows = [];
  const sheet = doc.getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();
  const cols = sheet.getLastColumn();

  var range = sheet.getRange(1,1,lastRow,cols);
  var values=range.getValues();
  
  for(let row in values){
    rows.push([]);
    for(let col in values[row]){
      rows[row].push(values[row][col]);
    }
  }
  return rows;
}
function getBehaviorLoops(){
  const rows = getRows("BehaviorLoops",8);
  let currentBehavior = "";
  let behaviorLoops={}

  for(let j=1;j<rows.length;j++){
    if(rows[j][0]!==""){
      currentBehavior = rows[j][0];
      behaviorLoop = [];
    }
    let behavior = {}
    for(let i = 1;i<rows[j].length;i++){
      if(rows[j][i]!=="")
      behavior[rows[0][i]]=rows[j][i];
    }
    behaviorLoop.push(behavior);
    behaviorLoops[currentBehavior]=behaviorLoop;
  }
  return behaviorLoops
}
function withGrid(n) {
    return n * 16;
  }
function asGridCoord(x,y){
    return `${x*16},${y*16}`
  }
