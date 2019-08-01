new Vue({
  el: '#app',
  data: {
    refreshTime: '60',
    nodeRefreshTime: '2',
    strings: {
      settings: browser.i18n.getMessage("settings"),
      jsonParsingFailed: browser.i18n.getMessage("jsonParsingFailed"),
      monitorOptionTitle: browser.i18n.getMessage("monitorOptionTitle"),
      showNotification: browser.i18n.getMessage("showNotification"),
      refreshTime: browser.i18n.getMessage("refreshTime"),
      nodeOptionTitle: browser.i18n.getMessage("nodeOptionTitle"),
      nodeRefreshTime: browser.i18n.getMessage("nodeRefreshTime"),
      optionsSaved: browser.i18n.getMessage("optionsSaved"),
      globalOptionTitle: browser.i18n.getMessage("globalOptionTitle"),
      defaultTab: browser.i18n.getMessage("defaultTab"),
      jenkinsToken: browser.i18n.getMessage("jenkinsToken"),
      addNewTokenBtn: browser.i18n.getMessage("addNewTokenBtn"),
      omniboxOptionTitle: browser.i18n.getMessage("omniboxOptionTitle"),
      searchFromJenkins: browser.i18n.getMessage("searchFromJenkins"),
      searchFromJenkinsPlaceholder: browser.i18n.getMessage("searchFromJenkinsPlaceholder"),
      searchFromJenkinsTips: browser.i18n.getMessage("searchFromJenkinsTips"),
      saveOptions: browser.i18n.getMessage("saveOptions"),
      jobStatsTitle: browser.i18n.getMessage("jobStatsTitle"),
      jobStatsTitleTip: browser.i18n.getMessage("jobStatsTitleTip"),
      jobStatsJenkinsPlaceholder: browser.i18n.getMessage("jobStatsJenkinsPlaceholder"),
      jobStatsNodeParamTip: browser.i18n.getMessage("jobStatsNodeParamTip"),
      jobStatsNodeParamPlaceholder: browser.i18n.getMessage("jobStatsNodeParamPlaceholder"),
      otherTitle: browser.i18n.getMessage("otherTitle"),
      enableParamsStashAndRecover: browser.i18n.getMessage("enableParamsStashAndRecover"),
      paramsStashAndRecoverTips: browser.i18n.getMessage("paramsStashAndRecoverTips"),
    },
    defaultTab: 'monitor',
    defaultTabs: [
      {
        text: browser.i18n.getMessage("monitor"),
        value: 'monitor',
      },
      {
        text: browser.i18n.getMessage("params"),
        value: 'params',
      },
      {
        text: browser.i18n.getMessage("computer"),
        value: 'computer',
      },
    ],
    showNotificationOption: 'all',
    showNotificationOptions: [
      {
        text: browser.i18n.getMessage("showNotificationOption_all"),
        value: 'all'
      },
      {
        text: browser.i18n.getMessage("showNotificationOption_unstable"),
        value: 'unstable'
      },
      {
        text: browser.i18n.getMessage("showNotificationOption_none"),
        value: 'none'
      },
    ],
    omniboxJenkinsUrl: '',
    nodeParam: '',
    jobStatsJenkinsUrl: '',
    jenkinsTokens: [],
    enableParamsStashAndRecover: true,
    optionsJson: '',
    isJsonView: false,
  },
  computed: {
    refreshTimeTip() {
      console.log(browser.i18n.getMessage("refreshTimeTip_1") + this.refreshTime +
        browser.i18n.getMessage("refreshTimeTip_2"));
      return browser.i18n.getMessage("refreshTimeTip_1") + this.refreshTime +
        browser.i18n.getMessage("refreshTimeTip_2");
    },
    nodeRefreshTimeTip() {
      console.log(browser.i18n.getMessage("nodeRefreshTimeTip_1") + this.nodeRefreshTime +
        browser.i18n.getMessage("nodeRefreshTimeTip_2"));
      return browser.i18n.getMessage("nodeRefreshTimeTip_1") + this.nodeRefreshTime +
        browser.i18n.getMessage("nodeRefreshTimeTip_2");
    }
  },
  mounted() {
    var _self = this;
    StorageService.getOptions(function (result) {
      // console.log('result', result);
      _self.refreshTime = result.refreshTime;
      _self.nodeRefreshTime = result.nodeRefreshTime || 2;
      _self.showNotificationOption = result.showNotificationOption;
      _self.defaultTab = result.defaultTab;
      _self.jenkinsTokens = result.jenkinsTokens || [];
      _self.omniboxJenkinsUrl = result.omniboxJenkinsUrl;
      _self.nodeParam = result.nodeParam;
      _self.jobStatsJenkinsUrl = result.jobStatsJenkinsUrl;
      if (result.enableParamsStashAndRecover === undefined) {
        _self.enableParamsStashAndRecover = true;
      } else {
        _self.enableParamsStashAndRecover = result.enableParamsStashAndRecover;
      }
    })
  },
  methods: {
    addNewToken() {
      this.jenkinsTokens.push({})
    },
    arrangeJenkinsTokens() {
      var arrangedJenkinsTokens = [];
      for (var i = 0; i < this.jenkinsTokens.length; i++) {
        var token = this.jenkinsTokens[i];
        if (token.hasOwnProperty('url') && token.url) {
          arrangedJenkinsTokens.push(token)
        }
      }
      // console.log('arrangedJenkinsTokens', arrangedJenkinsTokens);
      return arrangedJenkinsTokens
    },
    getThisOptions() {
      return {
        defaultTab: this.defaultTab,
        jenkinsTokens: this.arrangeJenkinsTokens(),
        refreshTime: this.refreshTime,
        nodeRefreshTime: this.nodeRefreshTime,
        showNotificationOption: this.showNotificationOption,
        omniboxJenkinsUrl: this.omniboxJenkinsUrl,
        nodeParam: this.nodeParam,
        jobStatsJenkinsUrl: this.jobStatsJenkinsUrl,
        enableParamsStashAndRecover: this.enableParamsStashAndRecover,
      };
    },
    saveOptions() {
      console.log('saveOptions');
      var _self = this;
      StorageService.saveOptions(_self.getThisOptions(), function () {
        _self.$refs.showSavedMsg.style.visibility = "";
        setTimeout(function () {
          _self.$refs.showSavedMsg.style.visibility = "hidden";
        }, 2000);
      })
    },
    optionsToJson() {
      this.optionsJson = JSON.stringify(this.getThisOptions(), null, 2)
    },
    jsonToOptions() {
      try {
        var options = JSON.parse(this.optionsJson);
        return true;
      } catch (e) {
        console.log('JSON解析失败：', e);
        this.isJsonView = true;
        alert(this.strings.jsonParsingFailed + ' :\n' + e);
        return false;
      }
    },
    switchView() {
      if (this.isJsonView) {
        // 需要切换到 UI View
        var result = this.jsonToOptions();
        if (result) {
          this.isJsonView = false;
        }
      } else {
        // 需要切换到 JSON View
        this.optionsToJson();
        this.isJsonView = true;
      }
    }
  },
});
