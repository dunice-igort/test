
<?php snippet('header') ?>
<?php snippet('menu') ?>
<?php snippet('submenu') ?>

<section class="content">

  <article>
  
    <div>
        <div id="slides-cont"><?php echo kirbytext($page->slide())?></div>
        <div id="blog-cont"><?php echo kirbytext($page->blog())?></div>
        <div id="twiter-cont"><?php echo kirbytext($page->twiter())?></div>
        <div id="sitemap-cont"><?php echo kirbytext($page->sitemap())?></div>
        <div id="support-chat-btn">support chat</div>
    </div>
    
  </article>

</section>
<?php snippet('footer') ?>
