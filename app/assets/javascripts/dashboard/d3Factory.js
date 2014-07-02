app.factory('d3', function ($document, $q, $rootScope) {
  var deferred = $q.defer();
  // Load D3 onto window object
  function onScriptLoad () {
    $rootScope.$apply(function () { deferred.resolve(window.d3); });
  }

  // Generate D3 <scipt> tag and run onScriptLoad in callback
  var scriptTag = $document[0].createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.async = true;
  scriptTag.src = 'http://d3js.org/d3.v3.min.js';
  scriptTag.onreadystatechange = function () {
    if (this.readyState === 'complete') {
      onScriptLoad();
    }
  };
  scriptTag.onload = onScriptLoad;

  // Append <script> to <body>
  var body = $document[0].getElementsByTagName('body')[0];
  body.appendChild(scriptTag);

  return {
    init: function () {
      return deferred.promise;
    }
  };
});
