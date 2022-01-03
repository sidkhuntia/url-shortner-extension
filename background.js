chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  console.log(tabs[0].url);
});
function checkForUrl(url) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(url);
}

chrome.runtime.onInstalled.addListener(function (details) {
  chrome.contextMenus.create({
    title: "Shorten the current hovered link and copy",
    contexts: ["link"],
    id: "shorternhoverlink",
  });
  chrome.contextMenus.create({
    title: "Shorten the current URL and copy",
    contexts: ["all"],
    id: "page",
  });
  chrome.contextMenus.create({
    title: "Shorten the image url and copy",
    contexts: ["image"],
    id: "shorternlink",
  });

  if (details.reason == "install") {
    chrome.storage.local.set({
      preferredURL: "isgd",
    });
    chrome.storage.local.set({ nightMode: "true" });
  }
});

// apis for URL shortening
var urlShorteners = {
  isgd: function (url) {
    return new Promise(function (resolve, reject) {
      url = encodeURIComponent(url);
      var xmlhttp;
      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      }
      xmlhttp.open(
        "GET",
        "https://is.gd/create.php?format=json&url=" + url + "&logstats=1",
        true
      );

      xmlhttp.onload = function () {
        if (xmlhttp.status == 200) {
          copyTextToClipboard(JSON.parse(xmlhttp.responseText).shorturl);
        } else {
          reject(Error(xmlhttp.statusText));
        }
      };
      // Handle network errors
      xmlhttp.onerror = function () {
        reject(Error("Network Error"));
      };
      xmlhttp.send();
    });
  },
  tinyurl: function (url) {
    var req = new XMLHttpRequest();
    req.open(
      "GET",
      "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url),
      true
    );
    req.addEventListener(
      "load",
      function (e) {
        var resp = req.responseText.replace("http://", "https://");
        copyTextToClipboard(resp);
      },
      false
    );
    req.send();
  },
  vgd: function (url) {
    return new Promise(function (resolve, reject) {
      url = encodeURIComponent(url);
      var xmlhttp;
      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      }
      xmlhttp.open(
        "GET",
        "https://v.gd/create.php?format=json&url=" + url + "&logstats=1",
        true
      );

      xmlhttp.onload = function () {
        if (xmlhttp.status == 200) {
          copyTextToClipboard(JSON.parse(xmlhttp.responseText).shorturl);
        } else {
          reject(Error(xmlhttp.statusText));
        }
      };
      // Handle network errors
      xmlhttp.onerror = function () {
        reject(Error("Network Error"));
      };
      xmlhttp.send();
    });
  },
  tnyim: function (url) {
    var req = new XMLHttpRequest();
    req.open(
      "GET",
      "https://tny.im/yourls-api.php?format=json&action=shorturl&url=" +
        encodeURIComponent(url),
      true
    );
    req.addEventListener(
      "load",
      function (e) {
        var resp = JSON.parse(req.responseText).shorturl.replace(
          "http://",
          "https://"
        );
        handleActions(url, resp);
      },
      false
    );
    req.send();
  },
  bitly: function (url) {
    chrome.storage.local.get(
      {
        ApiKey: false,
      },
      function (res) {
        let apiKey = res.ApiKey;
        if (apiKey) {
          let longurl = encodeURIComponent(url);
          var req = new XMLHttpRequest();
          req.open(
            "GET",
            "https://api-ssl.bitly.com/v3/shorten?access_token=" +
              apiKey +
              "&longUrl=" +
              longurl +
              "&domain=bit.ly&",
            true
          );
          req.addEventListener(
            "load",
            function (e) {
              //var resp = JSON.parse(req.responseText).shorturl.replace("http://", "https://");
              if (
                JSON.parse(req.responseText).status_txt ===
                "INVALID_ARG_ACCESS_TOKEN"
              ) {
                return 0;
              }
              var surl = JSON.parse(req.responseText).data.url;
              handleActions(url, surl);
            },
            false
          );
          req.addEventListener(
            "error",
            function (e) {
              console.log("ERror");
            },
            false
          );
          req.send();
        }
      }
    );
  },
  tly: function (url) {
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    chrome.storage.local.get(
      {
        ApiKey: false,
      },
      function (res) {
        let apikey = res.ApiKey;
        if (apikey) {
          fetch("https://t.ly/api/v1/link/shorten", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              long_url: url,
              domain: "https://t.ly/",
              api_token: apikey,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              copyTextToClipboard(json.short_url);
            });
        }
      }
    );
  },
};
//click event listener
chrome.contextMenus.onClicked.addListener(onClickHandler);
function copyTextToClipboard(data) {
  console.trace(data);
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = data;
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand("copy");
  body.removeChild(copyFrom);
}
function onClickHandler(info, tabs) {
  info.linkUrl = info.linkUrl || info.pageUrl;

  chrome.storage.local.get(
    {
      preferredURL: "isgd",
    },
    function (res) {
      if (info.menuItemId !== "shorternhoverlink") {
        if (tabs.url) {
          info.linkUrl = tabs.url;
        }
        if (info.srcUrl) {
          info.linkUrl = info.srcUrl;
        }
      }
      if (checkForUrl(info.linkUrl)) {
        urlShorteners[res.preferredURL](info.linkUrl);
      } else {
        return 0;
      }
    }
  );
}
