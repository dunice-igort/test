jQuery(function ($) {
  var socket = io.connect('http://localhost:3000'),
    messTemplaete = _.template($('#message-template').html()),
    adminChat = _.template($('#admin-chat-template').html()),
    user = {}

  findUser()
  socket.emit("find-admin", user)
  $("#chat-window").remove() 
   
  socket.on('admin-mess', function (data) {
    var dataMessArr = $(".display-mess"),
      appendSt = false
      _.each(dataMessArr, function (item) {
        var itemId = $(item).attr("id")
        if (itemId == data.idClient) {
          $(item).append(messTemplaete(data))
          appendSt = true
        }
      })
      if (!appendSt) {
        $("#admin-support").append(adminChat(data))
        $("#" + data.idClient).append(messTemplaete(data))
      }
    adminSendMess()
  })


  function adminSendMess() {
    $(".admin-text-mess").unbind("keypress")
    $(".admin-text-mess").unbind("focus")
    $(".close-admin-window").unbind("click")
    $(".admin-text-mess").on("keypress", function (event) {
      var mess = $(this).val()
      var idSend = $(this).attr("send")
      if (event.which == 13) {
        var data = {
          mess: mess,
          idSend: idSend,
          name: user.name
        }
        socket.emit("admin-send-mess", data)
        $(this).val("")
        $("#" + idSend).append(messTemplaete(data))
      }
    })

    $(".close-admin-window").on("click", function (event) {
      socket.emit("admin-send-mess", {
        name: "Info",
        mess: "Admin has logged out",
        idSend: $(this).parent().attr("send")
      })
      $(this).parent(".admin-chat").remove()
    })

    $(".admin-text-mess").on("focus", function (event) {
      $(this).parent().find(".no-read").removeClass("no-read")
    })
  }
  
  function findUser() {
    var userName = $("#userName").attr("name")
    var userId = $("#userName").attr("idUser")
    user={
        name:userName,
        id:userId
    }
  }
})
