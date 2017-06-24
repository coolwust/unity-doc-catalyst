var Background;
(function (Background) {
    var Tabs = chrome.tabs;
    var WebRequest = chrome.webRequest;
    var PageAction = chrome.pageAction;
    var main = [
        new RegExp('^file:///.*unity.*\.html$', 'iu'),
        new RegExp('^https://docs.unity3d.com/Manual/', 'iu'),
        new RegExp('^https://docs.unity3d.com/ScriptReference/', 'iu')
    ];
    var sub = [
        new RegExp('^file:///', 'ui'),
        new RegExp('^https://docs.unity3d.com/', 'ui'),
        new RegExp('^https://docs.unity3d.com/', 'ui')
    ];
    var indexes = new Map();
    WebRequest.onBeforeRequest.addListener(function (details) {
        if (details.type == 'main_frame') {
            for (var i = 0; i < main.length; i++) {
                if (main[i].test(details.url)) {
                    indexes.set(details.tabId, i);
                    return;
                }
            }
            console.log("hehe");
            indexes["delete"](details.tabId);
            return;
        }
        if (indexes.has(details.tabId)) {
            if (!sub[indexes.get(details.tabId)].test(details.url)) {
                return { cancel: true };
            }
        }
    }, { urls: ['<all_urls>'] }, ['blocking']);
    Tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        for (var i = 0; i < main.length; i++) {
            if (main[i].test(tab.url)) {
                PageAction.show(tabId);
                return;
            }
        }
        PageAction.hide(tabId);
    });
})(Background || (Background = {}));
