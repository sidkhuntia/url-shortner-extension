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
chrome.storage.local.get(["preferredURL"],function(url){
    preferredURL="isgd";
    console.log(url);
    var select = document.querySelector("select");
    console.log(select.options.length);
    for(var i=0;select.options.length;i++){
        var option = select.options[i];
        if((option.value) === url.preferredURL){
            option.selected = true;
        }
        else{
            return 0;
        }
    }
});


  function saveOptions(){
    $(".btn").html("SAVED !")
    setTimeout(function(){
        $(".btn").text("SAVE")
    },1000)
}
  
$("select").change(function(){
    save($(this).val());
})

function save(url){
    chrome.storage.local.set({"preferredURL":url },function(){
        chrome.storage.local.get(["preferredURL"],function(value){
            console.log(value);
        })
    });
}



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
