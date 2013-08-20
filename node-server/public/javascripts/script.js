jQuery(function($) {

  var socket = io.connect('http://dunice.ru:3000')
    , ownPriceRequestTemplate = _.template($('#owner-price-request-item').html())
    , priceRequestTemplate = _.template($('#non-owner-price-request-item').html());


  $(document).on('keyup', 'input[name="price"]', function(e) {
    var userId = $(this).siblings('input[name="userId"]').val()
      , priceId = $(this).siblings('input[name="priceId"]').val()
      , price = $(this).val();
    socket.emit('update-price', {userId: userId, price: price, priceId: priceId})
  })


  socket.on('connect', function() {
    socket.emit('get-prices')
  })


  function handlePrice(param) {
    var $prices = $('#product-'+param.productId).find('.prices')
      , $price = $('#price-'+param.priceId)
      , isOwner = $prices.hasClass('owner')
    console.log("$price", $price)

    if ($price.size() > 0) {
      if (isOwner) {
        $price.find('input[name="price"]').val(param.price);
      } else {
        $prices.find('.price-value').html(param.price);
      }
    } else {
      var _templ = (isOwner) ? ownPriceRequestTemplate : priceRequestTemplate
        , t = _templ({
          userId: param.userId,
          priceId: param.priceId,
          price: param.price,
          ownername: param.ownername
        })

      $prices.append(t);
    }
  }


  socket.on('receive-prices', function (data) {
    console.log("DDDDDDDDDDDDDD", data)
    _.each(data, handlePrice)
  })


  $('form.product').on('submit', function(event) {
    event.preventDefault()
    var productId = $(this).find('input[name="productId"]').val()
    socket.emit('request-price', productId)
  })


  $('form.price').on('submit', function(event) {
    event.preventDefault()
    var priceId = $(this).find('input[name="priceId"]').val()
      , price = $(this).find('input[name="price"]').val()
    socket.emit('send-price', {priceId: priceId, price: price})
  })


})
