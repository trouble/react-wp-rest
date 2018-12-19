<?php

///////////////////////////////////
// Add nonce to WP preview link
///////////////////////////////////

function set_headless_preview_link( $link, $post ) {

	if ($post->post_status === 'draft' || $post->post_status === 'auto-draft') {

		$path = '/wp-draft?id=' . $post->ID . '&';

		if ($post->post_type !== 'page') {
			$path = '/' . $post->post_type . $path;
		}
	} else {
		$path = str_replace(home_url(), '', get_permalink($post)) . '?';
	};

	return get_home_url()
		. $path
		. 'preview=true&_wpnonce='
		. wp_create_nonce( 'wp_rest' );
}
add_filter( 'preview_post_link', 'set_headless_preview_link', 10, 2 );

////////////////////////////////////////////////////////////////
// Create route for previewing post data of any post type
////////////////////////////////////////////////////////////////

function react_wp_get_preview_data(WP_REST_Request $request) {

	if ($request->get_param('id')) {
		$post_id = $request->get_param('id');
	} else {
		$post = get_post_by_slug($request->get_param('slug'));
		$post_id = $post->ID;
	}

	// Revisions are drafts so here we remove the default 'publish' status
	remove_action('pre_get_posts', 'set_default_status_to_publish');
	
	if ( $revisions = wp_get_post_revisions( $post_id, array( 'check_enabled' => false ) )) {
		$last_revision = reset($revisions);
		$rev_post = wp_get_post_revision($last_revision->ID);
		$controller = new WP_REST_Posts_Controller('post');
		$data = $controller->prepare_item_for_response( $rev_post, $request );
	} elseif ( $post = get_post( $post_id ) ) { 
		// There are no revisions, just return the saved parent post
		$controller = new WP_REST_Posts_Controller('post');
		$data = $controller->prepare_item_for_response( $post, $request );
	} else {
		return new WP_Error( 'rest_get_post_preview', 'Post ' . $post_id . ' does not exist',
			array( 'status' => 404 ) );
	}

	$response = $controller->prepare_response_for_collection( $data );
	return new WP_REST_Response($response);
}

////////////////////////////////////////////////////////////////
// Register route
////////////////////////////////////////////////////////////////

add_action( 'rest_api_init', function () {

	register_rest_route( 'react-wp-rest', '/preview', array(
		'methods' => 'GET',
		'callback' => 'react_wp_get_preview_data',
		'permission_callback' => function() {
			return current_user_can( 'edit_posts' );
		}
	) );
} );

?>
