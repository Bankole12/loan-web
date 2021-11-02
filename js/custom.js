/*--------------------------------------
	sidebar
--------------------------------------*/

"use strict";

$(document).ready(function () {
  $('#sidebar').toggleClass('active');
  /*-- sidebar js --*/
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });
});

/*--------------------------------------
    scrollbar js
--------------------------------------*/

var ps = new PerfectScrollbar('#sidebar');
