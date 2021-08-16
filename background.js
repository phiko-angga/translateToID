

// background.js
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  });
  

  // ------------------- Receive message from content.js START-------------------------
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      if( request.message === "data_item" ) {
        var dataItem = JSON.parse(request.data_item);
        get_data_item(dataItem);
      }else
      if( request.message === "result_scrap" ) {
        var judul = request.judul;
        var harga = request.harga;
        console.log(judul+'|'+harga);
      }else
      if( request.message === "open_url" ) {
        
          chrome.tabs.create({url: request.url, pinned: true}, function(tab) {
            console.log("berhasil : "+request.url);
          });
      }

      if( request.message === "open_data" ) {
          chrome.tabs.create({url: chrome.extension.getURL('background.html')});
          console.log("open data");
      }

    }
    
  );
  // ------------------- Receive message from content.js END-------------------------

  // ------------------- Event on Tab Updated (Reload/refresh) START-------------------------
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
    if (changeInfo.status == 'complete') {
      
      chrome.tabs.query({ active: true }, function(tabs) {
        console.log("onUpdated : "+tabs[0].url);
        check_url(tabs[0]);
      })
    }

    //wa_goto_send();
  }); 
  // ------------------- Event on Tab Updated (Reload/refresh) END-------------------------
 
  chrome.tabs.onCreated.addListener(function(tab){
    // check_url(tab);
  });

  chrome.tabs.onActivated.addListener(function(activeInfo) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, function(tab){
      // check_url(tab);
    });
   });  


  /** ----------------------- Function -------------------------- */
  function check_url(tab){

    const INTERVAL  = 200;
    var url = tab.url;
    //halaman 
    if(url.indexOf("https://www.bukalapak.com/u/") >= 0){
      item_scrap_tabid = null;
      
      if(user_scrap_tabid === null){
        user_scrap_tabid = tab.id;
        console.log("user_scrap_tabid "+user_scrap_tabid);
      }

      setTimeout(function(){  
        chrome.tabs.sendMessage(tab.id, {"message":"user","url_payload_productlist":url_payload_productlist});
      },INTERVAL);

      console.log("send message user : ");
    }else
    if(url.indexOf("https://www.bukalapak.com/p/") >= 0){
      console.log("check url : "+url);
      if(item_scrap_tabid === null)
        item_scrap_tabid = tab.id;

      setTimeout(function(){  
        chrome.tabs.sendMessage(tab.id, {"message": "scrap","tab_id":tab.id});
        console.log("message scrap");
      },INTERVAL);
    }
  }

  function get_data_item(data_item){
    var url = "";
    data_item.forEach(function(item, index) {
      url = item;
      if(item_scrap_tabid === null){   
        // chrome.tabs.create({url: item,active: false });
        // console.log("create "+item);
      }else{
        // chrome.tabs.update(item_scrap_tabid, {url:item }); 
        console.log("update "+item);
      }

    });
    chrome.tabs.create({url: url,active: false });
  }
