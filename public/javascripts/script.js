$(document).ready(function() {

  $('#slideshowHolder').jqFancyTransitions({ width: 400, height: 300 });
  // Handler for .ready() called.
  $('body').click(function(){
    console.log('::::::::::::::', $.fn.jqFancyTransitions.test)
    var img = new Image()
    var img = $("<img/>").attr('src', 'images/img4.jpg')
    console.log("imggggggggg", img)
    $('#slideshowHolder').appned
  })

});