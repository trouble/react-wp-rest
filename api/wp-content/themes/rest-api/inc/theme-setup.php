<?php

///////////////////////////////////
// Register menus
///////////////////////////////////

add_action( 'after_setup_theme', 'react_wp_rest_setup' );
function react_wp_rest_setup() {
	register_nav_menus(
		array( 'main-menu' => __( 'Main Menu', 'react_wp_rest' ) )
	);
}

///////////////////////////////////
// Enable upload of VCF, SVG
///////////////////////////////////

function custom_mime_types($mime_types){
	$mime_types['svg'] = 'image/svg+xml'; //Adding svg extension
	return $mime_types;
}
add_filter('upload_mimes', 'custom_mime_types', 1, 1);

///////////////////////////////////
// Update REST URL to match WordPress URL instead of SiteURL
///////////////////////////////////

add_filter( 'rest_url', 'biologos_update_rest_url', 10, 4 );
function biologos_update_rest_url( $url, $path, $blog_id, $scheme ){
	$newUrl = str_replace(get_home_url(), get_site_url(), $url);

	return $newUrl;
}

?>
