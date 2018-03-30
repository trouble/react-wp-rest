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

// Clear REST API cache on post save
add_action( 'save_post', function( $post_id ) {
	if ( class_exists( 'WP_REST_Cache' ) ) {
		WP_REST_Cache::empty_cache();
	}
});

?>