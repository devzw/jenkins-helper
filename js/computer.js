new Vue({
  el: '#app',
  data: {
    strings: {
      monitor: chrome.i18n.getMessage("monitor"),
      params: chrome.i18n.getMessage("params"),
      computer: chrome.i18n.getMessage("computer"),
    },
    monitoredNodes: {},
  },
  mounted() {
    this.queryMonitoredNodes();
    StorageService.addStorageListener(this.nodeStatusChange);
  },
  computed: {},
  methods: {
    nodeStatusChange(changes) {

    },
    queryMonitoredNodes() {
      var _self = this;
      StorageService.getNodeStatus(function (result) {
        console.log('monitoredNodes', result);
        _self.monitoredNodes = result;
      });
    },
    // 磁盘空间是否未达阈值
    isSafe: function (node) {
      var remainingDiskSpace = parseInt(node.remainingDiskSpace.replace('GB', '').trim());
      var threshold = node.diskSpaceThreshold;
      return remainingDiskSpace > threshold;
    },
    openNodesManager(jenkinsUrl) {
      chrome.windows.create({
        url: 'computers_manager.html?jenkins=' + jenkinsUrl,
        type: 'popup',
        width: 1200,
        height: 800,
      }, function (window) {
        console.log('window', window)
      })
    },
    openOptions() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage(); // Chrome 42+, Firefox 48
      } else {
        chrome.tabs.create({'url': chrome.runtime.getURL('options.html')});
      }
    },
    openJobList() {
      chrome.windows.create({
        url: 'job_stats.html',
        type: 'popup',
        width: 1000,
        height: 800,
      }, function (window) {
        console.log('window', window)
      })
    },
  }
});
