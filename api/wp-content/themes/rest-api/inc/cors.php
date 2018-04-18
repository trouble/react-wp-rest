<?php

/**
 * Allow GET requests from SSR and dev CRA origins
 * Thanks to https://joshpress.net/access-control-headers-for-the-wordpress-rest-api/
 */
add_action( 'rest_api_init', function() {

	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
	add_filter( 'rest_pre_serve_request', function( $value ) {

		// Site URL defined in WP
		$allowed_origin_1 = get_home_url();

		// Create React App Default Port 3000
		$parsed = parse_url($allowed_origin_1);
		$allowed_origin_2 = $parsed['scheme'] . '://' . $parsed['host'] . ':3000';

		// Need to allow both SSR and dev CRA access
		if(isset($_SERVER['HTTP_ORIGIN'])) {
			$origin = $_SERVER['HTTP_ORIGIN'];
			if($origin == $allowed_origin_1 || $origin == $allowed_origin_2) {
				header('Access-Control-Allow-Origin: ' . $origin);
			}
		}

		header( 'Access-Control-Allow-Methods: GET' );
		header( 'Access-Control-Allow-Credentials: true' );
		return $value;
	});
}, 15 );

?>