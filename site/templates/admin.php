<?php snippet('header') ?>
<?php echo js('assets/js/admin-script.js') ?>

<?php 

Auth::firewall(array(
  'allow' => array('group:admin')
)) 

?>
<div> Hello admin </div>
<div id="admin-support"></div>
