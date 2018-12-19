<?php

///////////////////////////////////
// Add button to clear Redux store's API content to Toolbar
///////////////////////////////////

add_action( 'admin_bar_menu', 'add_clear_redux_store_btn', 999 );

function add_clear_redux_store_btn( $wp_admin_bar ) {
	$args = array(
		'id'    => 'clear_redux',
		'title' => 'Clear WordPress Cache',
		'href'  => get_home_url() . '/clear-redux-store?redirect=' . get_site_url() . urlencode($_SERVER['REQUEST_URI'])
	);
	$wp_admin_bar->add_node( $args );
}

///////////////////////////////////
// Provide message to admins on cache clear
///////////////////////////////////

add_action('admin_notices', 'show_redux_store_cleared_msg');

function show_redux_store_cleared_msg() {

	// Only show this message on the admin dashboard and if asked for
	if (!empty($_GET['redux-store-cleared'])) {
		echo '<div class="notice notice-success"><p>The cache has been cleared successfully!</p></div>';
	}
}

///////////////////////////////////
// Clear post cache on post save
///////////////////////////////////

add_action( 'post_updated', function( $post_id ) {
	$post = get_post($post_id);

	// If post is being updated
	// Note: this fixes the 'Add New' button, because we don't want to clear cache
	// if new post.  Only if old post is updated
    if( $post->post_modified_gmt !== $post->post_date_gmt ){
		$slug = $post->post_name;
		$type = $post->post_type;
		$url = get_home_url();

		// If localhost, replace string to host.docker.internal
		// so that Docker container can reach host Node process.
		// TODO - move Node process to Docker and remove this logic
		if (strpos($url,'localhost') !== false) {
		    $url = str_replace('localhost', 'host.docker.internal', $url);
		}

		$clear_cache_url = $url . '/clear-redux-store' . '/' . $type . '/' . $slug;

		// Fire the GET request to clear the Redux cache
		wp_remote_get($clear_cache_url);
    }
});

?>
