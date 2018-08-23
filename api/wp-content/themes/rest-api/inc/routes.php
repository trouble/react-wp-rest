<?php

////////////////////////////////////////////////////////////////
// Creates route for succinctly sending a list 
// of all published pages including templates used
////////////////////////////////////////////////////////////////

function react_wp_rest_get_page_routes() {
	$pages = get_pages();
	$names = [];

	foreach ($pages as $page) {
		if ($page->post_status === 'publish') {

			// Add template name to object
			$template = get_page_template_slug( $page->ID );

			// Clean up template filename
			$template = str_replace('.php', '', $template);
			$template = str_replace('page-', '', $template);

			$name = array(
				'path' => get_page_uri($page->ID),
				'slug' => $page->post_name,
				'template' => $template,
				'type' => 'page'
			);

			array_push($names, $name);
		}
	}

	return $names;
}

////////////////////////////////////////////////////////////////
// Create route for previewing post data of any post type
////////////////////////////////////////////////////////////////

function react_wp_rest_get_preview_data(WP_REST_Request $request) {

	$post = get_post_by_slug($request->get_param('slug'));

	$post_id = $post->ID;

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
// Register routes
////////////////////////////////////////////////////////////////

add_action( 'rest_api_init', function () {
	register_rest_route( 'react-wp-rest', '/pages/list', array(
		'methods' => 'GET',
		'callback' => 'react_wp_rest_get_page_routes',
	) );

	register_rest_route( 'react-wp-rest', '/preview', array(
		'methods' => 'GET',
		'callback' => 'react_wp_rest_get_preview_data',
		'permission_callback' => function() {
			return current_user_can( 'edit_posts' );
		}
	) );
} );

?>
