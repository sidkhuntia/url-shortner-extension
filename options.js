
chrome.storage.local.get({ "nightMode": "" }, function (result) {
    if(result.nightMode === "true"){
        document.body.classList.add("night");
    }
  });

$(".dark input").on("change",function(){
    var checked = $(this).is(":checked");
    if(checked){
        $("body").addClass("night");
    }else{
        $("body").removeClass("night");
    }
    chrome.storage.local.set({ "nightMode": String(checked) },function(){
        chrome.storage.local.get({"nightMode":""},function(value){
            console.log(value)
        })
        
    });
});