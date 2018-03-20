<section id="main" role="main">
  <header class="page-header" style="background-image: url('<?php echo $image[0]; ?>')"> 
    <h1><?php echo apply_filters( 'the_title', get_the_title( get_option( 'page_for_posts' ) ) ); ?></h1>
  </header>
  <div class="page-content">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <?php get_template_part( 'entry' ); ?>
    <?php endwhile; else : ?>
      <h2>Nothing Found</h2>
      <p>Sorry, we can't find what you're looking for.</p>
      <p><a class="btn arrow" href="/">Back to home</a></p>
    <?php endif; ?>
  </div>
</section>