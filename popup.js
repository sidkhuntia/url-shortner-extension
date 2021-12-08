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
    "api_token": "sYLBhJWitAKosyEUM6lFfcjmebLqnbo3jMwuyBgZnFg4PSSxb0YCQaA8QAlS",
}

fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
})
    .then(response => response.json())
    .then(json => {
        console.log(json)
        output.value = json.short_url;   
    });






//    b1b9168a05dd400d143c4637b310804ab45d5b31
//    sYLBhJWitAKosyEUM6lFfcjmebLqnbo3jMwuyBgZnFg4PSSxb0YCQaA8QAlS