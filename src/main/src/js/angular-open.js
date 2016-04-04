if (typeof File === 'undefined') {
    File = function() {
        return false;
    };
}
if (typeof console === 'undefined') {
  console = {
    log: function() {}
  };
}
(function() {