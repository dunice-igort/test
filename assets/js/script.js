jQuery(function($) {

  var socket = io.connect('http://localhost:3000')
  var messTemplaete = _.template($('#message-template').html())
  var user = {name:''}
  renderUser(user)

  $(".log_btn").on('click', function(){
    $('.modal').modal('show')
  })
  
  $(".btn-ok").on('click', function(){
    console.log('btrn-ok')
    var logName = $("#login-name").val()
      , logPass = $("#login-pass").val()
    user = {name: logName}
    renderUser(user)
//    socket.emit('find-user', {
//      user:logName,
//      pass:logPass
//    })
  })
  
  socket.on('user-logged',function (data) {
     console.log("daaaaa", data)
  })

  $(".title_chat").on('click', function(event) {
    $("#chat-window").toggleClass("collapsed", !$("#chat-window").hasClass("collapsed"))
  })
  
  $("#ld_sp").on('click', function(event) {
    $("#chat-window").toggleClass("collapsed", !$("#chat-window").hasClass("collapsed"))
  })

  $("#support-chat-btn").on("click", function(event) {
    $("#chat-window").removeClass('collapsed')
  })


  $("#text-mess").on('keypress', function(event) {
    
    console.log("event.which ",event.which )
    var mess = $("#text-mess").val()
    if(event.which == 13){
      var data = {
        name : user.name,
        mess : mess
      }
      sendMessage(data)
      $("#text-mess").val("")
    }

  })


  
  function renderUser(user) {
    $("#chat-window").toggleClass('logged', !(user.name == ''))
    $("#userName").html((user.name) ? user.name : 'please login')
    $('.modal').modal('hide')
  }
   
  function sendMessage(data) {
    socket.emit('client-send-mess', data)
  }
    
    
  socket.on('new-mess', function (data) {
    $("#display-mess").append(messTemplaete(data))
  })



})
