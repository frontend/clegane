'use strict';

/* global app, angular */

app.filter('year', function() {
  return function(input) {
    return input.split('-')[0];
  };
});

app.filter('loopbreak', function() {
  return function(input, step) {
    if ((input+1) % (12 / step) === 0) {
      return '</div></div><div class="row"><div class="col-sm-'+step+'">';
    }
  };
});

app.filter('typeaheadid', function() {
  return function(input) {
    var inputs = input.split('-'),
        id = inputs[inputs.length-1];
    return id;
  };
});
