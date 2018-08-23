<?php

function react_wp_rest_get_menu($data) {

	$menu_items = wp_get_nav_menu_items($data['slug']);

	if ($menu_items) {
		foreach ($menu_items as $item) {

			if ($item->object === 'page') {
				$post = get_post($item->object_id); 
				$slug = $post->post_name;

				$item->url = '/' . $slug;
			}
		}

		return array(
			'slug' => $data['slug'],
			'menu' => $menu_items
		);
	}

	return array();
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'react-wp-rest', 'menus/(?P<slug>[a-zA-Z0-9-]+)', array(
		'methods'  => 'GET',
		'callback' => 'react_wp_rest_get_menu'
	) );
} );

?>
