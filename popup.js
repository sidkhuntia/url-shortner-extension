var button = document.querySelector(".short");
var input = document.querySelector(".inputurl");
var output = document.querySelector(".outputurl");
var curenttaburl = "";

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  console.log(tabs[0].url);
  curenttaburl = tabs[0].url;
  input.value = tabs[0].url;
});

function(curenttaburl) {
    chrome.storage.local.get({
        bitlyApiKey: false,
    }, function (res) {
        let apiKey =  res.bitlyApiKey;
        if(apiKey){
        let longurl = encodeURIComponent(url);
        var req = new XMLHttpRequest();
        req.open("GET", "https://api-ssl.bitly.com/v3/shorten?access_token="+ apiKey + "&longUrl="+longurl+"&domain=bit.ly&", true);
        req.addEventListener("load", function (e) {
            //var resp = JSON.parse(req.responseText).shorturl.replace("http://", "https://");
            if(JSON.parse(req.responseText).status_txt === "INVALID_ARG_ACCESS_TOKEN")
            {
                return 0;
            }
            var surl = (JSON.parse(req.responseText)).data.url;
            saveToStorage(url, surl);
            copyTextToClipboard(surl);
        }, false);
        req.addEventListener("error", function (e) {
            //var resp = JSON.parse(req.responseText).shorturl.replace("http://", "https://");
           console.log("errro");
        }, false);
        req.send();
    }
    });
}
//    b1b9168a05dd400d143c4637b310804ab45d5b31
