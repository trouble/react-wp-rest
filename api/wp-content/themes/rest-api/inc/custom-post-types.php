<?php 

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
		'parent' => __( 'Parent Static Content' )
	),
	'rewrite'    => array (
	    'with_front' => false
	),
	'supports' => array( 'title', 'editor', 'thumbnail' ),
	'show_in_rest' => true
) );

?>