const deploymentID = "AKfycbwrj2HhJ87jtVUXAwvnByNY7fmYHqtDiPC9CGmInCqsc57lh2dHnXiWPL5QGPkj3WTU";
let url = "https://script.google.com/macros/s/"+deploymentID+"/exec";
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