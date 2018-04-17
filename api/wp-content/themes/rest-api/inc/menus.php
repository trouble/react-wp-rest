<?php

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

?>