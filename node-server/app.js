
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , connect = require('connect')
  , cookie = require('cookie')
  , passport= require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , _ = require('underscore')
  , RedisStore = require('connect-redis')(connect)
  , uuid = require('uuid')
  , MemoryStore = express.session.MemoryStore


var users = [
  { id: 1, username: 'Bob', password: 'secret', email: 'bob@example.com' }
, { id: 2, username: 'Joe', password: 'secret', email: 'joe@example.com' }
, { id: 3, username: 'Igor', password: 'secret', email: 'joe@example.com' }
]

var products = [
  {id: 1, ownerId: 1, name: 'pr1', src: 'images/shirt.png'}
, {id: 2, ownerId: 1, name: 'pr2', src: 'images/shirt.png'}
, {id: 3, ownerId: 2, name: 'pr3', src: 'images/shirt.png'}
, {id: 4, ownerId: 3, name: 'pr4', src: 'images/shirt.png'}
, {id: 5, ownerId: 2, name: 'pr5', src: 'images/shirt.png'}
, {id: 6, ownerId: 3, name: 'pr6', src: 'images/shirt.png'}
]

var prices = {}

function findUserById(id) {
  var idx = id - 1
  if (users[idx]) {
    return users[idx]
  } else {
    new Error('User ' + id + ' does not exist')
    return null
  }
}

function findProductById(id) {
  var idx = id - 1
  if (products[idx]) {
    return products[idx]
  } else {
    new Error('Product ' + id + ' does not exist')
    return null
  }
}


function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i]
    if (user.username === username) {
      return fn(null, user)
    }
  }
  return fn(null, null)
}

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  done(null, findUserById(id))
})

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }) }
        return done(null, user)
      })
    })
  }
))

var app = express()

var sessionOptions = {
  key: 'connect.sid',
  secret: 'secret123',
  store: new RedisStore()
}

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.cookieParser())
app.use(express.session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))


app.use(function(req, res, next){
  res.locals.users = users
  res.locals.user = req.user
  res.locals.products = _.map(products, function(product) {
    return _.extend({}, product, {
      user: findUserById(product.ownerId)
    })
  })
  next()
})

app.use(app.router)


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler())
}

app.get('/', routes.index)
app.get('/about', routes.about);
app.get('/work', routes.work);
app.get('/store', routes.index);




app.get('/login',
  passport.authenticate('local', { failureRedirect: '/me'}),
  function(req, res) {
    res.redirect('/')
  })

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

app.get('/me', function (req, res) {
  res.send(req.user)
})

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})

var io = require('socket.io').listen(server)

io.set('authorization', function (data, accept) {
  if (!data.headers.cookie)
    return accept('No cookie transmitted.', false)
  var parsedCookie = cookie.parse(data.headers.cookie)
  var secret = sessionOptions.secret
  data.cookie = parsedCookie[sessionOptions.key]
  data.sessionID = connect.utils.parseSignedCookie(data.cookie, secret)
  sessionOptions.store.load(data.sessionID, function (err, session) {
    if (err || !session) {
      return accept('Error', false)
    }
    data.session = session
    session.reload(function () {
      var val = 'nobody'
      if (session.passport.user)
        val = session.passport.user.username
      session.value = val
      session.touch().save()
    })
    return accept(null, true)
  })
})

io.sockets.on('connection', function (socket) {
    
  var userId = socket.handshake.session.passport.user
    , user = findUserById(userId)
    

  socket.on('find-user', function(data) {
    socket.userInfo={
      name:data.name,
      id:data.id,
      group:"users"
     }
  })

  socket.on('get-prices', function() {
    if (!user) return
    var myPrices = _.filter(prices, function(price, priceId) {
      return (price.ownerId == userId) || (price.userId == userId)
    })
    this.emit('receive-prices', myPrices)
  })

  socket.on('find-admin', function(data) {
    console.log("data",data)
    if(data){
      socket.userInfo={
        name:data.name,
        id:data.id,
        group:"admin"
      }
      app.adminId = socket.id
    }
  })
  
  socket.on('admin-send-mess', function(data) {
    io.sockets.clients().forEach(function(client){
        if(client.userInfo.id == data.idSend){
          client.emit('new-mess', [data])
        }
      })
    
  })

  socket.on('client-send-mess', function(data) {
      io.sockets.clients().forEach(function(client){
        console.log("*************************************")
        console.log("______________________________________")
        console.log("client:", client)
        console.log("______________________________________")
        console.log("*************************************")
        
        if(client.userInfo.id == socket.userInfo.id){
          client.emit('new-mess', [data])
        }
        if(client.userInfo.group == "admin"){
          data.idClient = socket.userInfo.id
          client.emit('admin-mess', data)
        }

//        if(client.id == socket.id){
//          client.emit('new-mess', [data])
//        }
//        if(app.adminId == client.id){
//          data.idClient = socket.id
//          client.emit('admin-mess', data)
//        }
      })
  })
  socket.on('update-price', function(data) {
    var price = prices[data.priceId]
    if (!price) return

    price.price = data.price
    sendClientNotifications(price)
  })

  socket.on('request-price', function(productId){
      var product = findProductById(productId)
        , ownerId = product.ownerId
        , pricesDB = filterPrices(productId, userId)

      if (pricesDB.length == 0) {
        var priceId = uuid.v1()
          , userById = findUserById(userId)
          , priceData = {
            productId: productId,
            userId: userId,
            priceId: priceId,
            ownerId: ownerId,
            ownername:(userById) ? userById.username : 'user',
            price: ''
          }
        prices[priceId] = priceData
        sendClientNotifications(priceData)
      }
  })

  function filterPrices (productId, userId){
    return _.filter(prices, function(price, priceId) {
      return (price.productId == productId) && (price.userId == userId)
    })
  }

  function sendClientNotifications(price){
    io.sockets.clients().forEach(function(client){
      var clientId = client.handshake.session.passport.user
      if (clientId == price.userId || clientId == price.ownerId)
        client.emit('receive-prices', [price])
    })
  }
})

