/* Module for maps application */
var MapsApplication = function () {

/* add members here */

  var init = function () {
    /* add code to initialize this module */
    ko.applyBindings(MapsApplication);
  };

  /* execute the init function when the DOM is ready */
  $(init);
  
  return {
    /* add members that will be exposed publicly */
  };
}();