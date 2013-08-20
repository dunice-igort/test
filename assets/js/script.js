jQuery(function($) {
    
  var socket = io.connect('http://localhost:3000')
    , messTemplaete = _.template($('#message-template').html())
    , user = {}
    , adminChat = _.template($('#admin-chat-template').html())
    , chatWindow = _.template($('#chat-window-template').html())
//    , reg = new RegExp("admin")
//    , hits = location.pathname.match(reg)
  
  $("body").append(chatWindow)
  findUser()
  
  socket.on('user-logged',function (data) {
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

  function findUser() {
    var userName = $("#userName").attr("name")
    var userId = $("#userName").attr("idUser")
    user={
        name:userName,
        id:userId
    }
    $("#chat-window").toggleClass('logged', !(user.name == 'false'))
    socket.emit("find-user",user)
  }
  
  function sendMessage(data) {
    socket.emit('client-send-mess', data)
  }
  
  socket.on('new-mess', function (data) {
    $("#mess-apender").append(messTemplaete(data[0]))
  })
  
})
