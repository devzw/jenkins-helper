(function () {
  "use strict";
  redirect();

  // top.location="monitor.html";
  function redirect() {
    StorageService.getOptions(function (result) {
      if (result.defaultTab === 'monitor') {
        window.location.href = "monitor.html";
      } else if (result.defaultTab === 'params') {
        window.location.href = "params.html";
      } else if (result.defaultTab === 'computer') {
        window.location.href = "computer.html";
      } else if (result.defaultTab === 'tools') {
        window.location.href = "jenkins_tools.html";
      } else {
        window.location.href = "monitor.html";
      }
    })
  }

})();
