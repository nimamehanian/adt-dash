app.filter('capitalize', function () {
  return function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
});

app.filter('os', function () {
  return function (string) {
    switch (string) {
      case 'ios'     : return 'iOS';
      case 'android' : return 'Android';
    }
  };
});

app.filter('centsless', function () {
  return function (string) {
    return string.replace('.00', '');
  };
});

app.filter('commaSeparate', function ($filter) {
  var currency = $filter('currency');
  var centsless = $filter('centsless');
  return function (number) {
    return centsless(currency(number)).replace('$', '');
  };
});

app.filter('pacing', function () {
  return function (string) {
    switch (string) {
      case 'remaining_even' : return 'Remaining Even';
      case 'overall_even'   : return 'Overall Even';
      case 'asap'           : return 'ASAP';
    }
  };
});

app.filter('toAmPm', function () {
  return function (hours) {
    var display = '';
    _(hours).each(function (hour) {
      if (hour === 0) {
        display += '12am, ';
      } else if (hour >= 1 && hour <= 11) {
        display += hour + 'am, ';
      } else if (hour === 12) {
        display += '12pm, ';
      } else if (hour >= 13 && hour <= 23) {
        hour = hour - 12;
        display += hour + 'pm, ';
      }
    });
    return display.slice(0, -2);
  };
});

app.filter('ellipsis', function () {
  return function (string) {
    return string.replace(string.slice(string.length - 3), '...');
  };
});

app.filter('daySuffix', function () {
  return function (number) {
    if (!Number(number)) { return number; }

    // Converts 0-padded digits--like 01, 02--to 1, 2, etc.
    number = number.replace(/0[1-9]{1}/, number.match(/[1-9]{1}/)[0]);

    var st = ['1', '21', '31'];
    var nd = ['2', '22'];
    var rd = ['3', '23'];

    if (!_(st).contains(number) && !_(nd).contains(number) && !_(rd).contains(number)) {
      return number + 'th';
    } else if (_(st).contains(number)) {
      return number + 'st';
    } else if (_(nd).contains(number)) {
      return number + 'nd';
    } else if (_(rd).contains(number)) {
      return number + 'rd';
    }
  };
});

app.filter('truncInt', function () {
  return function (num) {
    var num = String(num);

    if (num.length < 4) {
      return num;
    }

    if (num.length === 4) {
      return num.substr(0, 1) + 'k';
    }

    if (num.length === 5) {
      return num.substr(0, 2) + 'k';
    }

    if (num.length === 6) {
      return num.substr(0, 3) + 'k';
    }

    if (num.length === 7) {
      if (num.substr(1, 1) === '0') {
        return num.substr(0, 1) + 'm';
      } else {
        return num.substr(0, 1) + '.' + num.substr(1, 1) + 'm';
      }
    }

    if (num.length === 8) {
      if (num.substr(2, 1) === '0') {
        return num.substr(0, 2) + 'm';
      } else {
        return num.substr(0, 2) + '.' + num.substr(2, 1) + 'm';
      }
    }

    if (num.length === 9) {
      if (num.substr(3, 1) === '0') {
        return num.substr(0, 3) + 'm';
      } else {
        return num.substr(0, 3) + '.' + num.substr(3, 1) + 'm';
      }
    }
  };
});
