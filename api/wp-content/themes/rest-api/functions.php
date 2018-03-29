<?php

//////////////////////////////
// MISC SETUP
//////////////////////////////

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

// Clear REST API cache on post save
add_action( 'save_post', function( $post_id ) {
	if ( class_exists( 'WP_REST_Cache' ) ) {
		WP_REST_Cache::empty_cache();
	}
});

//////////////////////////////
// REGISTER POST TYPES
//////////////////////////////

register_post_type( 'static-content', array(
	'public' => true,
	'has_archive' => true,
	'menu_position' => 22, // places menu item directly below Pages

	'labels' => array(
		'name' => __( 'Static Content' ),
		'singular_name' => __( 'Static Content' ),
		'add_new' => __( 'Add New' ),
		'add_new_item' => __( 'Add New Static Content' ),
		'edit' => __( 'Edit' ),
		'edit_item' => __( 'Edit Static Content' ),
		'new_item' => __( 'New Static Content' ),
		'view' => __( 'View Static Content' ),
		'view_item' => __( 'View Static Content' ),
		'search_items' => __( 'Search Static Content' ),
		'not_found' => __( 'No Static Content found in Trash' ),
		'parent' => __( 'Parent Static Content' ),
		'show_in_rest' => true,
	),
	'supports' => array( 'title', 'editor', 'thumbnail' ),
	'show_in_rest' => true
) );

//////////////////////////////
// ADD REST ROUTES
//////////////////////////////

function get_main_menu() {
	# Change 'menu' to your own navigation slug.

	$menu_items = wp_get_nav_menu_items('main');
	
	foreach ($menu_items as $item) {

		if ($item->object === 'page') {
			$post = get_post($item->object_id); 
			$slug = $post->post_name;

			$item->url = '/' . $slug;
		}
	}

	return $menu_items;
}

add_action( 'rest_api_init', function () {
		register_rest_route( 'menus', '/main', array(
		'methods' => 'GET',
		'callback' => 'get_main_menu',
	) );
} );

function get_pages_list() {
	# Change 'menu' to your own navigation slug.
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
				'template' => $template
			);
			array_push($names, $name);
		}
	}

	return $names;
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'pages', '/list', array(
		'methods' => 'GET',
		'callback' => 'get_pages_list',
	) );
} );

?>
