// checking option on load
chrome.storage.local.get(["nightMode"], function (result) {
    if(result.nightMode === "true"){
        document.body.classList.add("night");
        $(".dark input[type=checkbox]").prop("checked", true);
    }
  });
chrome.storage.local.get(["copytoclipboard"], function (result) {
    if(result.copytoclipboard === "true"){
        $(".copy input[type=checkbox]").prop("checked", true);
    }
  });



//night mode toggle 
$(".dark input").on("change",function(){
    var checked = $(this).is(":checked");
    if(checked){
        $("body").addClass("night");
    }else{
        $("body").removeClass("night");
    }
    chrome.storage.local.set({ "nightMode": String(checked) },function(){
        chrome.storage.local.get(["nightMode"],function(value){
            console.log(value)
        })
        
    });
});

// copy to clipboard
$(".copy input").on("click",function(){
    var checked = $(this).is(":checked");
    chrome.storage.local.set({ "copytoclipboard": String(checked) },function(){
        chrome.storage.local.get(["copytoclipboard"],function(value){
            console.log(value)
        })
    });
});
