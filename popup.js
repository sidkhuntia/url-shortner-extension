var button = $(".short");
var input = $(".inputurl");
var output = $(".outputurl");
var curenttaburl = "";
var url = "";

function checkForUrl(url) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  curenttaburl = tabs[0].url;
  url = curenttaburl;
  input.val(curenttaburl);
});

function copytoClipboard(text) {
    chrome.storage.local.get(["copytoclipboard"], function (result) {
      if(result.copytoclipboard === "true"){
        navigator.clipboard.writeText(text);
        button.text("Copied!");
        setTimeout(function(){
            button.text("Shorten");
        },1000);
      }
    });
}

function handleActions(lurl,res){
// tnyim return wrong error when url is short correct 
    if(!checkForUrl(url)){
        output.val("ERror")
        return 0;
    }
    copytoClipboard(res);
    output.val(res);
}


button.click(()=>{
    output.val("Loading....");
    chrome.storage.local.get({
        preferredURL: "isgd",
    }, function (res) {
        preferredShortURL = res.preferredURL;
        urlShorteners[preferredShortURL](url);
    });

});
var urlShorteners = {
  tinyurl: function (url) {
      var req = new XMLHttpRequest();
      req.open("GET", "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url), true);
      req.addEventListener("load", function (e) {
          var resp = req.responseText.replace("http://", "https://");
          handleActions(url, resp);
      }, false);
      req.send();
  },
  isgd: function (url) {
    $.ajax({
        url: "https://is.gd/create.php?format=json&url=" + encodeURIComponent(url) + "&logstats=1",
        type: 'GET',
        success: function (response) {
            response = JSON.parse(response);
            if (response.errorcode === 4) {
                var message= 'Your network address is banned from shortening URLs, usually due to abuse of our service in the past.' + "So please change to tinyurl by clicking Setting icon";
                output.val(message);
                return 0;
            }
            console.log(response);
            handleActions(curenttaburl,response.shorturl);
        }, error: function () {
        }
    });

  },
  vgd: function (url) {
      $.ajax({
          url: "https://v.gd/create.php?format=json&url=" + encodeURIComponent(url) + "&logstats=1",
          type: 'GET',
          success: function (response) {
              response = JSON.parse(response);
              if (response.errorcode === 4) {
                  var message = document.querySelector('#message');
                  message.innerText = 'Your network address is banned from shortening URLs, usually due to abuse of our service in the past.' + "So please change to tinyurl by clicking Setting icon";
                  return 0;
              }
              handleActions(url, response.shorturl);
          }, error: function () {
          }
      });

  },
  tnyim:  function(url){
      var req = new XMLHttpRequest();
      req.open("GET", "https://tny.im/yourls-api.php?format=json&action=shorturl&url=" + encodeURIComponent(url), true);
      req.addEventListener("load", function (e) {
          var resp = JSON.parse(req.responseText).shorturl.replace("http://", "https://");
          handleActions(url, resp);
      }, false);
      req.send();
  },
  bitly: function(url){
      chrome.storage.local.get({
          ApiKey: false,
      }, function (res) {
          let apiKey =  res.ApiKey;
          if(apiKey){
          let longurl = encodeURIComponent(url);
          var req = new XMLHttpRequest();
          req.open("GET", "https://api-ssl.bitly.com/v3/shorten?access_token="+ apiKey + "&longUrl="+longurl+"&domain=bit.ly&", true);
          req.addEventListener("load", function (e) {
              //var resp = JSON.parse(req.responseText).shorturl.replace("http://", "https://");
              if(JSON.parse(req.responseText).status_txt === "INVALID_ARG_ACCESS_TOKEN")
              {
                  var message = document.querySelector('.error');
                  message.innerText = 'Check the access token is correct for bitly in options page';
                  $(".error").show();
                  removeLoader();
                  return 0;
              }
              var surl = (JSON.parse(req.responseText)).data.url;
              handleActions(url, surl);
          }, false);
          req.addEventListener("error", function (e) {
              //var resp = JSON.parse(req.responseText).shorturl.replace("http://", "https://");
             console.log("errro");
          }, false);
          req.send();
      }
      });
  },
  tly: function(url){
    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    chrome.storage.local.get({
        ApiKey: false
    },function (res){
        let apikey = res.ApiKey;
        if(apikey){
            fetch("https://t.ly/api/v1/link/shorten", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                  "long_url": url,
                  "domain": "https://t.ly/",
                  "api_token": apikey,
                })
            })
                .then(response => response.json())
                  .then(json => {
                    handleActions(url,json.short_url) 
                });
        }
    });

  }
};





//checking for night mode
chrome.storage.local.get({ "nightMode": "" }, function (result) {
  if(result.nightMode === "true"){
      document.body.classList.add("night");
  }
});




//    b1b9168a05dd400d143c4637b310804ab45d5b31                     - bit.ly
//    iv6iqOYJe5V3ZsOjsxMRsEYOb1y5nYqFyiVzkavkNyZBXIBz7R3I7Xb8aFw9 - t.ly
