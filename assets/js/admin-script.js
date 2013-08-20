  var socket = io.connect('http://localhost:3000')
    , messTemplaete = _.template($('#message-template').html())
    , user = {}
    , adminChat = _.template($('#admin-chat-template').html())
    , chatWindow = _.template($('#chat-window-template').html())
    , reg = new RegExp("admin")
    , hits = location.pathname.match(reg)
    
    
  socket.emit("find-admin",true)
