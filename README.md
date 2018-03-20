# react-wp-rest
This repo provides a boilerplate for pairing the WP Rest API with a React frontend.  

## Getting Started
Clone this repository locally - then rename the created folder and the name of the client-facing project within `client/package.json`.  Once you're all happy and renamed, `cd` to the `client` folder and type `npm install`.

## Docker
First, make sure you have Docker installed locally.  Once you do, `cd` to `/api` to duplicate and rename `docker-compose.yml.example` by running `cp docker-compose.yml.example docker-compose.yml`.  Then, edit `api/docker-compose.yml` to link your local filesystem with Docker's Wordpress files.  Open up our newly duplicated `docker-compose.yml` and change the following to match your local install directory:


````
  volumes: 
    - ~/www/react-wp-rest/api:/var/www/html
````

Once this is done, ensure you're still in the `api` directory and and type `docker-compose up -d`.  You can now reach your WP instance via `http://localhost:8080`!

