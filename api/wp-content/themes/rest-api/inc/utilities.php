<?php
// Gets a post of any type by its slug
function get_post_by_slug($slug){
    $posts = get_posts(array(
            'name' => $slug,
            'post_type' => 'any',
            'posts_per_page' => 1,
            'post_status' => 'publish'
    ));
    
    if (!$posts ) {
        throw new Exception("NoSuchPostBySpecifiedSlug");
    }

    return $posts[0];
}
?>