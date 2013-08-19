jQuery(function($) {
    
  var socket = io.connect('http://localhost:3000')
    , messTemplaete = _.template($('#message-template').html())
    , user = {name:'test'}
    , adminChat = _.template($('#admin-chat-template').html())
    , chatWindow = _.template($('#chat-window-template').html())
    , reg = new RegExp("admin")
    , hits = location.pathname.match(reg)
    
  renderUser(user)
  
  if(hits){
    socket.emit("find-admin",true)
  }else{
    socket.emit("find-admin",false)
    $("body").append(chatWindow)
  }
  
  $(".log_btn").on('click', function(){
    $('.modal').modal('show')
  })
  
  $(".btn-ok").on('click', function(){
    var logName = $("#login-name").val()
      , logPass = $("#login-pass").val()
    user = {name: logName}
    renderUser(user)
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
  
  function adminSendMess() {
    $(".admin-text-mess").unbind("keypress")
    $(".admin-text-mess").unbind("focus")
    $(".close-admin-window").unbind("click")
    $(".admin-text-mess").on("keypress", function(event) {
      var mess = $(this).val()
      var idSend = $(this).attr("send")
      if(event.which == 13){
        console.log("press")
        var data = {
          mess:mess,
          idSend:idSend,
          name:"Admin"
        }
        socket.emit("admin-send-mess",data)
        $(this).val("")
        $("#"+idSend).append(messTemplaete(data))
      }
    })
    
    $(".close-admin-window").on("click",function (event) {
     socket.emit("admin-send-mess", {name: "Info", mess:"Admin has logged out", idSend: $(this).parent().attr("send")})
     $(this).parent(".admin-chat").remove()
    })

    $(".admin-text-mess").on("focus",function (event) {
     $(this).parent().find(".no-read").removeClass("no-read")
    })
  }
    
  socket.on('new-mess', function (data) {
    $("#mess-apender").append(messTemplaete(data[0]))
  })
  
  socket.on('admin-mess', function (data) {
    var dataMessArr = $(".display-mess")
      , appendSt = false
    _.each(dataMessArr,function (item) {
      var itemId = $(item).attr("id")
      if(itemId == data.idClient){
        $(item).append(messTemplaete(data))
        appendSt = true
      }
    })
    if(!appendSt){
      $("#admin-support").append(adminChat(data))
      $("#"+data.idClient).append(messTemplaete(data))
    }
    adminSendMess()
  })
})
