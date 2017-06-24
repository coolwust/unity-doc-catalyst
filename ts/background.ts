namespace Background {

  import Tabs = chrome.tabs;
  import Runtime = chrome.runtime;
  import WebRequest = chrome.webRequest;
  import PageAction = chrome.pageAction;

  let main = [
    new RegExp('^file:///.*unity.*\.html$', 'iu'),
    new RegExp('^https://docs.unity3d.com/Manual/', 'iu'),
    new RegExp('^https://docs.unity3d.com/ScriptReference/', 'iu')
  ];

  let sub = [
    new RegExp('^file:///', 'ui'),
    new RegExp('^https://docs.unity3d.com/', 'ui'),
    new RegExp('^https://docs.unity3d.com/', 'ui')
  ];

  let indexes = new Map<number, number>();

  WebRequest.onBeforeRequest.addListener((details) => {
    if (details.type == 'main_frame') {
      for (let i = 0; i < main.length; i++) {
        if (main[i].test(details.url)) {
          indexes.set(details.tabId, i);
          return;
        }
      }
      indexes.delete(details.tabId);
      return;
    } 
    if (indexes.has(details.tabId)) {
      if (!sub[indexes.get(details.tabId)].test(details.url)) {
        return {cancel: true};
      }
    }
  }, {urls: ['<all_urls>']}, ['blocking']);

  Tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    for (let i = 0; i < main.length; i++) {
      if (main[i].test(tab.url)) {
        PageAction.show(tabId);
        return;
      }
    }
    PageAction.hide(tabId);
  });
}

