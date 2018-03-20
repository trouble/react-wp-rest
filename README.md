# react-wp-rest
This repo provides a boilerplate for pairing the WP Rest API with a React frontend.  

## Getting Started
Clone this repository locally - then rename the created folder and the name of the client-facing project within `client/package.json`.  Once you're all happy and renamed, `cd` to the `client` folder and type `npm install`.

## Docker
First, make sure you have Docker installed locally.  Then, you'll need to edit `api/docker-compose.yml` to link your local filesystem with Docker's Wordpress files.  Open up `api/docker-compose.yml` and change the following to match your local install directory.


````
  volumes: 
    - ~/www/react-wp-rest/api:/var/www/html
````

Once this is done, `cd` into `api` and type `docker-compose up -d`.  Make sure Docker is running, of course!

