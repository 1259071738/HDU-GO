'use strict';

chrome.storage.sync.get({pickLesson: {blockCaptcha: false}}, function (option) {
  const {
    pickLesson: {
      blockCaptcha
    }
  } = option;

  if (blockCaptcha) {
    chrome.webRequest.onBeforeRequest.addListener(
      function() { return {cancel: true}; },
      {urls: ["http://jxgl.hdu.edu.cn/CheckCode.aspx"]},
      ["blocking"]
    );
  }
});
