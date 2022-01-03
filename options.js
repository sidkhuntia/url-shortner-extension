// checking option on load
chrome.storage.local.get(
  ["nightMode", "copytoclipboard", "qrcode", "qrdownload", "ApiKey"],
  function (result) {
    if (result.nightMode === "true") {
      document.body.classList.add("night");
      $(".dark input[type=checkbox]").prop("checked", true);
    }
    if (result.copytoclipboard === "true") {
      $(".copy input[type=checkbox]").prop("checked", true);
    }
    if (result.qrcode === "true") {
      $(".qr input[type=checkbox]").prop("checked", true);
    }
    if (result.qrdownload === "true") {
      $(".qrdown input[type=checkbox]").prop("checked", true);
    }
    if (result.ApiKey) {
      $(".api").val(result.ApiKey);
    }
  }
);

chrome.storage.local.get(["preferredURL"], function (url) {
  console.log(url.preferredURL);

  var select = document.querySelector("select");
  // console.log(select.options.length);
  for (var i = 0; select.options.length; i++) {
    var option = select.options[i];
    if (option.value === url.preferredURL) {
      option.selected = true;
    } else {
      return 0;
    }
  }
});

$("select").change(function () {
  save($(this).val());
  var selected = $(this).val();
  if (selected === "bitly" || selected === "tly") {
    $(".api").show();
  } else {
    $(".api").hide();
  }
});

function save(url) {
  chrome.storage.local.set({ preferredURL: url }, function () {
    chrome.storage.local.get(["preferredURL"], function (value) {
      console.log(value);
    });
  });
}

$("#data").submit(function (e) {
  let accessKey = $(".api").val();
  if (accessKey.length > 5) {
    chrome.storage.local.set({ ApiKey: accessKey }, function () {
      console.log("api key saved");
    });
    $(".btn").html("SAVED !");
    setTimeout(function () {
      $(".btn").text("SAVE");
    }, 1000);
  }
  e.preventDefault();
  return false;
});

//night mode toggle
$(".dark input").on("change", function () {
  var checked = $(this).is(":checked");
  if (checked) {
    $("body").addClass("night");
  } else {
    $("body").removeClass("night");
  }
  chrome.storage.local.set({ nightMode: String(checked) }, function () {
    chrome.storage.local.get(["nightMode"], function (value) {
      console.log(value);
    });
  });
});

// copy to clipboard
$(".copy input").on("click", function () {
  var checked = $(this).is(":checked");
  chrome.storage.local.set({ copytoclipboard: String(checked) }, function () {
    chrome.storage.local.get(["copytoclipboard"], function (value) {
      console.log(value);
    });
  });
});
//QR Code Generation
$(".qr input").on("click", function () {
  var checked = $(this).is(":checked");
  chrome.storage.local.set({ qrcode: String(checked) }, function () {
    chrome.storage.local.get(["qrcode"], function (value) {
      console.log(value);
    });
  });
});
//QR code image download
$(".qrdown input").on("click", function () {
  var checked = $(this).is(":checked");
  chrome.storage.local.set({ qrdownload: String(checked) }, function () {
    chrome.storage.local.get(["qrdownload"], function (value) {
      console.log(value);
    });
  });
});
