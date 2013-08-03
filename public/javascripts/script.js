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


  var Item = Backbone.Model.extend({
    defaults: function() {
      return {
        title: "tile",
        url: "http://vk.com",
        done: false
      };
    },
    toggle: function() {
      this.save({done: !this.get("done")});
    }
  })

  var ItemList = Backbone.Collection.extend({
    model: Item
   })

  var itemList = new ItemList;

});