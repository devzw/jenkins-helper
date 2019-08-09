var Omnibox = (function () {
  "use strict";

  var allJobs = [];
  var defaultSuggestionUrl = '';

  getAllJobs();

  // 当用户输入时触发
  browser.omnibox.onInputChanged.addListener(function (text, suggest) {
    // console.log('text', text);
    if (!text) return;
    var suggestContent = filterJobs(text);
    // console.log('suggestContent', suggestContent);
    return suggest(suggestContent)
  });

  // 当用户接收关键字建议时触发
  browser.omnibox.onInputEntered.addListener(function (text) {
    // console.log('inputEntered', text);
    if (!text) return;
    if (text.indexOf('http') !== 0) {
      text = defaultSuggestionUrl + 'job/' + text + '/'
    }
    navigate(text)
  });

  function navigate(url) {
    browser.tabs.query({active: true, currentWindow: true}).then(function (tabs) {
      browser.tabs.update(tabs[0].id, {url: url});
    });
  }

  function getAllJobs() {
    allJobs = [];
    StorageService.getOptions(function (result) {
      var jenkinsUrls = result.omniboxJenkinsUrl.split('\n');
      for (var i = 0; i < jenkinsUrls.length; i++) {
        var url = jenkinsUrls[i].trim();
        if (url === '') {
          continue
        }
        url = url.charAt(url.length - 1) === '/' ? url : url + '/';
        if (!defaultSuggestionUrl) {
          defaultSuggestionUrl = url;
          browser.omnibox.setDefaultSuggestion({
            description: url + 'job/%s/'
          });
        }

        (function (url) {
          var encodeParam = encodeURI('jobs[name,url]');
          var jsonUrl = url + 'api/json?tree=' + encodeParam;

          Tools.getFetchOption(jsonUrl, function (header) {
            fetch(jsonUrl, header).then(function (res) {
              if (res.ok) {
                return res.json();
              } else {
                return Promise.reject(res);
              }
            }).then(function (data) {
              if (data.hasOwnProperty('jobs')) {
                allJobs = allJobs.concat(data.jobs);
                // console.log('all fetched', allJobs)
              }
            }).catch(function (e) {
              console.error("获取Job失败", e);
            });
          })
        })(url)
      }
    })
  }

  // 过滤符合输入的 Job
  function filterJobs(text) {
    var suggests = [];
    var len = allJobs.length;
    for (var i = 0; i < len; i++) {
      if (allJobs[i].name.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
        suggests.push({
          content: decodeURIComponent(allJobs[i].url),
          description: decodeURIComponent(allJobs[i].url)
        })
      }
    }
    return suggests;
  }

  return {
    getAllJobs: getAllJobs
  }
})();
