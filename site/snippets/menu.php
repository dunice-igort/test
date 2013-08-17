
<nav class="menu">
  <img src="<?php echo url('assets/images/logo.jpg') ?>" width="115" height="41" class="fl"/>
  <ul class="fr">
    <?php foreach($pages->visible() AS $p): ?>
    <li><a<?php echo ($p->isOpen()) ? ' class="active"' : '' ?> href="<?php echo $p->url() ?>"><?php echo html($p->title()) ?></a></li>
    <?php endforeach ?>
  </ul>
</nav>
