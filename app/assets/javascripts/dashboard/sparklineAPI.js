app.factory('SparklineAPI',
function ($q, LineItemAPI) {
  return {
    getReporting: function (campaignId) {
      return LineItemAPI.getList(campaignId)
      .then(function (lineItems) {
        var allPromises = _(lineItems).map(function (lineItem) {
          return LineItemAPI.getReporting(lineItem.id)
          .then(function (report) {
            return (report.length > 8) ? _.last(report, 8) : report;
          });
        });
        return $q.all(allPromises)
      });
    }
  };
});
