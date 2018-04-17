<?php

// Register menus
add_action( 'after_setup_theme', 'react_wp_rest_setup' );
function react_wp_rest_setup() {
	register_nav_menus(
		array( 'main-menu' => __( 'Main Menu', 'react_wp_rest' ) )
	);
}

// Enable upload of VCF, SVG
function custom_mime_types($mime_types){
	$mime_types['svg'] = 'image/svg+xml'; //Adding svg extension
	return $mime_types;
}
add_filter('upload_mimes', 'custom_mime_types', 1, 1);

// Add button to clear Redux store's API content to Toolbar
add_action( 'admin_bar_menu', 'add_clear_redux_store_btn', 999 );

function add_clear_redux_store_btn( $wp_admin_bar ) {
	$args = array(
		'id'    => 'clear_redux',
		'title' => 'Clear WordPress Cache',
		'href'  => get_home_url() . '/clear-redux-store?redirect=' . get_site_url() . urlencode($_SERVER['REQUEST_URI'])
	);
	$wp_admin_bar->add_node( $args );
}

// Provide message to admins on cache clear
add_action('admin_notices', 'show_redux_store_cleared_msg');

function show_redux_store_cleared_msg() {

	// Only show this message on the admin dashboard and if asked for
	if (!empty($_GET['redux-store-cleared'])) {
		echo '<div class="notice notice-success"><p>The cache has been cleared successfully!</p></div>';
	}
}

// Clear post cache on post save
add_action( 'save_post', function( $post_id ) {
	$post = get_post($post_id); 

	// If post is being updated
	// Note: this fixes the 'Add New' button, because we don't want to clear cache
	// if new post.  Only if old post is updated
    if( $post->post_modified_gmt !== $post->post_date_gmt ){
		$slug = $post->post_name;

		$redirect = get_home_url() . '/clear-redux-store' . '/' . $slug . '?redirect=' . urlencode($_SERVER['HTTP_REFERER']);

		wp_redirect( $redirect );
		exit;
    }
});

// Add nonce to WP preview link
function set_headless_preview_link( $link, $post ) {

	$path = str_replace(home_url(), '', get_permalink($post));

	// If post type is page, set type equal to blank string
	$type = $post->post_type === 'page'
		? ''
		: '/' . $post->post_type;

	return get_home_url()
		. $type
		. $path
		. '?preview=true&_wpnonce='
		. wp_create_nonce( 'wp_rest' );
}
add_filter( 'preview_post_link', 'set_headless_preview_link', 10, 2 );

?>