const deploymentID = "AKfycbzSXkcTuE8QtLSLrsOfNFvNhnSIdO8LenduKa1L8y159-pyI2hWno_0bx4BIP62AHri";
let lang = "es";
let url = "https://script.google.com/macros/s/"+deploymentID+"/exec?lang="+lang;

async function requestContent(){
  try {
      const response = await fetch(url);
      if (response.ok) { // if HTTP-status is 200-299
          let json = await response.json();
          
          // console.log(json["content"]);
          
          return json["content"];
        } else {
          console.log("HTTP-Error: " + response.status);
        }
        
    } catch (error) {
      console.log(`Fetch error: ${error.name}`);
    }
}
async function swithchLangage(){
  lang = lang==="es"?"en":"es";
  let url2 = "https://script.google.com/macros/s/"+deploymentID+"/exec?lang="+lang+"&langOnly=true";
  try {
    const response = await fetch(url2);
    if (response.ok) { // if HTTP-status is 200-299
        let json = await response.json();
        
        console.log(json["content"]);
        window.localizationDict = json["content"];
        //return json["content"];
      } else {
        console.log("HTTP-Error: " + response.status);
      }
      
  } catch (error) {
    console.log(`Fetch error: ${error.name}`);
  }
}