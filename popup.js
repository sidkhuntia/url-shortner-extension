var button = $(".short");
var input = $(".inputurl");
var output = $(".outputurl");
var curenttaburl = "";
var url = "";

function checkForUrl(url) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(url);
}

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  curenttaburl = tabs[0].url;
  input.val(curenttaburl);
});

function copytoClipboard(text) {
  chrome.storage.local.get(["copytoclipboard"], function (result) {
    if (result.copytoclipboard === "true") {
      navigator.clipboard.writeText(text);
      $(".clipboard").removeClass("hide");
    }
  });
}

function generateQR(url) {
  chrome.storage.local.get(["qrcode", "qrdownload"], function (result) {
    if (result.qrcode === "true") {
      var qrapi =
        "https://api.qrserver.com/v1/create-qr-code/?data=" +
        encodeURIComponent(url) +
        "&amp;size=150x150";
      $(".qrimg").attr("src", qrapi);
      $(".qr").removeClass("hide");
      if (result.qrdownload === "true") {
        $(".qr").on("click", function () {
          downloadImage(qrapi);
          console.log("Clicked!");
        });
        $(".qr").css("cursor", "pointer");
      }
    }
  });
}

input.on("click", function () {
  $(".clipboard").addClass("hide");
  $(".qr").addClass("hide");
  input.select();
});
output.on("focus", function () {
  output.select();
});

function handleActions(lurl, res) {
  // tnyim return wrong error when url is short correct
  copytoClipboard(res);
  output.val(res);
  generateQR(lurl);
}

button.click((event) => {
  url = input.val();
  if (!checkForUrl(url)) {
    event.preventDefault();
    $(".error").removeClass("hide");
    $(".errmsg").text("The given text is not a URL");
    return 0;
  }
  chrome.storage.local.get({ ApiKey: "" }, function (res) {
    if (!res.ApiKey || res.ApiKey < 7) {
      $(".error").removeClass("hide");
      $(".errmsg").text("Please check the access key in Settings.");
    }
  });
  output.val("Loading....");
  chrome.storage.local.get(
    {
      preferredURL: "isgd",
    },
    function (res) {
      preferredShortURL = res.preferredURL;
      urlShorteners[preferredShortURL](url);
    }
  );
});
var urlShorteners = {
  isgd: function (url) {
    $.ajax({
      url:
        "https://is.gd/create.php?format=json&url=" +
        encodeURIComponent(url) +
        "&logstats=1",
      type: "GET",
      success: function (response) {
        response = JSON.parse(response);
        if (response.errorcode === 4) {
          var message =
            "Your network address is banned from shortening URLs, usually due to abuse of our service in the past." +
            "So please change to tinyurl by clicking Setting icon";
          $(".error").removeClass("hide").css("height", "120px");
          $(".errmsg").text(message);
          return 0;
        }
        console.log(response);
        handleActions(curenttaburl, response.shorturl);
      },
      error: function () {},
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
        handleActions(url, resp);
      },
      false
    );
    req.send();
  },
  vgd: function (url) {
    $.ajax({
      url:
        "https://v.gd/create.php?format=json&url=" +
        encodeURIComponent(url) +
        "&logstats=1",
      type: "GET",
      success: function (response) {
        response = JSON.parse(response);
        if (response.errorcode === 4) {
          var message =
            "Your network address is banned from shortening URLs, usually due to abuse of our service in the past." +
            "So please change to tinyurl by clicking Setting icon";
          $(".error").removeClass("hide").css("height", "120px");
          $(".errmsg").text(message);
          return 0;
        }
        handleActions(url, response.shorturl);
      },
      error: function () {},
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
                var message = "Please check access token in Settings.";
                $(".error").removeClass("hide");
                $(".errmsg").text(message);
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
              var message =
                "Your network address is banned from shortening URLs, usually due to abuse of our service in the past." +
                "So please change to tinyurl by clicking Setting icon";
              $(".error").removeClass("hide").css("height", "120px");
              $(".errmsg").text(message);
              return 0;
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
              handleActions(url, json.short_url);
            });
        }
      }
    );
  },
};

async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  var time = new Date();
  time =
    time.toISOString().slice(0, 10) +
    " " +
    time.toLocaleTimeString().replace(/:/g, "-");

  link.download = "qrcode_" + time + ".png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//checking for night mode
chrome.storage.local.get({ nightMode: "" }, function (result) {
  if (result.nightMode === "true") {
    document.body.classList.add("night");
  }
});

//    b1b9168a05dd400d143c4637b310804ab45d5b31                     - bit.ly
//    iv6iqOYJe5V3ZsOjsxMRsEYOb1y5nYqFyiVzkavkNyZBXIBz7R3I7Xb8aFw9 - t.ly
