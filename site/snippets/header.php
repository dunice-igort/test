<!DOCTYPE html>
<html lang="en">
<head>
  
  <title><?php echo html($site->title()) ?> - <?php echo html($page->title()) ?></title>
  <meta charset="utf-8" />
  <meta name="description" content="<?php echo html($site->description()) ?>" />
  <meta name="keywords" content="<?php echo html($site->keywords()) ?>" />
  <meta name="robots" content="index, follow" />
  <script src="assets/js/libs/jquery.js"></script>
  <script src="assets/js/libs/bootstrap.min.js"></script>
  <script src="assets/js/libs/underscore-min.js"></script>
  <script src="assets/js/libs/socket.io.min.js"></script>
  <script src="assets/js/script.js"></script>
 
  <script type="text/template", id="message-template">
    <div>
      <span class="name-message"><%=name%> : </span>
      <span><%=mess%></span>
    </div>
  </script>
  
  <?php echo css('assets/styles/styles.css') ?>
  <?php echo css('assets/styles/bootstrap.css') ?>


</head>

<body>

  <header>
    <div class="user-name dib">ADAPTIV -<span id="userName"></span></div>
    <div class="dib fr log_btn">Login</div>
    <a href="/kirbycms/kirbycms-panel"><div id="temp-button" class="dib header-button"></div></a>
  </header>

      
      <div id="chat-window" class="collapsed logged">
      <div id="ld_sp"> Please login ... </div>
        <div class="title_chat">
            Live-support
        </div>
        <div id="chat_content">
            <div id="display-mess"></div>
            <span>Enter a message</span>
            <textarea id="text-mess"></textarea>
        </div>
  </div>
  

<div id="login-modal" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 id="myModalLabel">Login</h3>
  </div>
  <div class="modal-body">
    <table>
        <tr>
          <td>
            <lable name="name">Enter you name</lable>
          </td>
          <td>
            <input name="name" type="text" id="login-name"></input>
          </td>
        </tr>
        <tr>
          <td>
            <lable name="password">Enter you password &nbsp</lable>
          </td>
          <td>
            <input name="password" id="login-pass" type="password"></input>
          </td>
        </td>
    </table>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    <button class="btn btn-ok">Login</button>
  </div>
</div>
  
  
  <div id="container">
  