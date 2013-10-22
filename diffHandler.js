var jsdiff = require('diff');

var diffHandler = function(oldBio, newBio) {
  var diff = jsdiff.diffWords(oldBio, newBio);
  var frag = '';

  for (var i=0; i < diff.length; i++) {
    if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
      var swap = diff[i];
      diff[i] = diff[i + 1];
      diff[i + 1] = swap;
    }

    var node;
    if (diff[i].removed) {
      node = '<del>' + diff[i].value + '</del>';
    } else if (diff[i].added) {
      node = '<ins>' + diff[i].value + '</ins>';
    } else {
      node = diff[i].value;
    }

    frag += node;
  }

  console.log(frag);
  return frag;
};

exports.diffHandler = diffHandler;

