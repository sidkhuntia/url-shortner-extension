var button = document.querySelector(".short");
var input = document.querySelector(".inputurl");
var output = document.querySelector(".outputurl");
var curenttaburl = "";
const url = new URL("https://t.ly/api/v1/link/shorten"); 



let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  console.log(tabs[0].url);
  curenttaburl = tabs[0].url;
  input.value = tabs[0].url;
});



let body = {
    "long_url": JSON.stringify(curenttaburl),
    "domain": "https://t.ly/",
    "api_token": "iv6iqOYJe5V3ZsOjsxMRsEYOb1y5nYqFyiVzkavkNyZBXIBz7R3I7Xb8aFw9",
}
button.addEventListener('click',()=>{
    console.log("khuntia");
    output.value="Loading...."
    fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          "long_url": curenttaburl,
          "domain": "https://t.ly/",
          "api_token": "iv6iqOYJe5V3ZsOjsxMRsEYOb1y5nYqFyiVzkavkNyZBXIBz7R3I7Xb8aFw9",
        })
    })
        .then(response => response.json())
          .then(json => {
            console.log(JSON.stringify(curenttaburl))
            console.log(json)
            output.value = json.short_url;   
          
        });
});

//checking for night mode
chrome.storage.local.get({ "nightMode": "" }, function (result) {
  if(result.nightMode === "true"){
      document.body.classList.add("night");
  }
});




//    b1b9168a05dd400d143c4637b310804ab45d5b31
//    iv6iqOYJe5V3ZsOjsxMRsEYOb1y5nYqFyiVzkavkNyZBXIBz7R3I7Xb8aFw9 - t.ly
//    yRKAZ2yaqEMLkjVwwGFJHJZUQyDqi9OHb6873dyYXmYPRAyn4Ew9lj4gqoLb - TINY URL