// checking option on load

browser.storage.local.get(
  [
    "nightMode",
    "copytoclipboard",
    "qrcode",
    "qrdownload",
    "ApiKey",
    "preferredURL",
  ],
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
    $("select").val(result.preferredURL).attr("selected", "selected");
    if (result.preferredURL == "bitly") {
      $(".api").removeClass("hide");
    } else {
      $(".btn").css("margin-top","0px");
      $(".api").addClass("hide");
    }
  }
);
$(".api").on("focus", function () {
  $(this).select();
  $(".errmsg").addClass("hide");
});
var selected_api;
$("select").change(function () {
  selected_api = $(this).val();
  if (selected_api === "bitly") {
    $(".api").removeClass("hide");
    $(".btn").css("margin-top","20px");
  } else {
    $(".btn").css("margin-top","0px");
    $(".api").addClass("hide");
  }
  $(".errmsg").addClass("hide");
});

function save(url) {
  browser.storage.local.set({ preferredURL: url }, function () {
    browser.storage.local.get(["preferredURL"], function (value) {
      console.log(value);
    });
  });
}

$("#data").submit(function (e) {
  e.preventDefault();
  if (selected_api == "bitly") {
    let accessKey = $(".api").val();
    if (accessKey.length > 5) {
      browser.storage.local.set({ ApiKey: accessKey }, function () {
        // console.log("api key saved");
      });
      $(".errmsg").addClass("hide");
    } else {
      $(".errmsg").removeClass("hide");
      return false;
    }
  }
  save(selected_api);
  $(".btn").html("SAVED !");
  setTimeout(function () {
    $(".btn").text("SAVE");
  }, 1000);
});

//night mode toggle
$(".dark input").on("change", function () {
  var checked = $(this).is(":checked");
  if (checked) {
    $("body").addClass("night");
  } else {
    $("body").removeClass("night");
  }
  browser.storage.local.set({ nightMode: String(checked) }, function () {
    browser.storage.local.get(["nightMode"], function (value) {
      console.log(value);
    });
  });
});

// copy to clipboard
$(".copy input").on("click", function () {
  var checked = $(this).is(":checked");
  browser.storage.local.set({ copytoclipboard: String(checked) }, function () {
    browser.storage.local.get(["copytoclipboard"], function (value) {
      console.log(value);
    });
  });
});
//QR Code Generation
$(".qr input").on("click", function () {
  var checked = $(this).is(":checked");
  browser.storage.local.set({ qrcode: String(checked) }, function () {
    browser.storage.local.get(["qrcode"], function (value) {
      console.log(value);
    });
  });
});
//QR code image download
$(".qrdown input").on("click", function () {
  var checked = $(this).is(":checked");
  browser.storage.local.set({ qrdownload: String(checked) }, function () {
    browser.storage.local.get(["qrdownload"], function (value) {
      console.log(value);
    });
  });
});
