# Server Side Rendered / Code Split React + Wordpress REST API - built by Keen (WIP)
This repo provides a boilerplate for pairing the WP Rest API with a server-side rendered and code split React client, built by [Keen](https://keen-studio.com).

Wordpress, MySQL, PHP and PHPMyAdmin are all provided by Docker which makes it easy to spin up new instances of WP sites both for local development and for production on hosts like DigitalOcean.

## Getting Started
Clone this repository locally and `cd` to the `client` folder and type `npm install`.

### Set Up Environment
The React app relies on an `.env` file to configure itself to its environment, and this repo ships with an example that you can copy and rename.  To do so, make sure you're still in the `/client` directory, and then duplicate / rename `.env.example` by running `cp .env.example .env`.  The example `.env` file comes preloaded with the URL to the default Docker installation of Wordpress.

### Docker
First, make sure you have Docker installed locally.  Once you do, `cd` to `/api` to duplicate and rename `docker-compose.yml.example` by running `cp docker-compose.yml.example docker-compose.yml`.  Now we need to edit `api/docker-compose.yml` to link your local filesystem with Docker's Wordpress files.  To do so, open up our newly duplicated `docker-compose.yml` and change the following to match your local install directory.  

**NOTE:** You only need to change the path located _before_ the colon. In this case, replace `~/www/react-wp-rest` with your install directory.

````
  volumes:
    - ~/www/react-wp-rest/api:/var/www/html
````

You may want to also swap all `ex_` prefixes for your project's abbreviation to avoid using the same container across multiple projects.

Feel free to make any other changes you'd like to the default user and database configurations but there's no real need locally. Just don't use defaults in production.

Next, fire up Docker if it isn't already. Once this is done, ensure you're still in the `api` directory and and type `docker-compose up -d`.  You can now reach your WP instance via `http://localhost:8080`.

### Wordpress Configuration
After you're up and running, we need to navigate to `http://localhost:8080/wp-admin` and perform the following steps to Wordpress:

1. Activate the REST API theme
2. Activate plugins ACF PRO and ACF to REST API
3. Import boilerplate ACF custom fields by navigating to `Custom Fields -> Tools`, and uploading `api/acf/acf-meta.data.json`.  This will add meta fields to each Page and Post by default, avoiding the need for Yoast SEO or similar plugins.  Extend and add to other post types as you need
4. Add a new page called `Home`, set it to use the `Home` page template, and then set it as your front page in the `Settings -> Reading -> Your homepage displays` section
5. Change Permalinks to the 'Custom Structure' option and enter `/post/%postname%/`
6. Update your Site Address within `Settings -> General` to your SSR app (default: http://localhost:1337)

*Note:* It's important that the Site Address update is performed last in the order above.

### Booting up the SSR app

The server-side rendering configuraton in place serves the `/client/build` folder on port `1337`.  The `/build` folder contains the results of `create-react-app`'s `npm run build` command - so before attempting to test SSR, make sure you first run `npm run build`. After that, run `npm run serve` while still in the `/client` directory to fire up the server.

### Getting to Work

At this point, you can get to work. For a development workflow, we've included `create-react-app` so we can rely on all the goodness that comes with it. `cd` into `/client` and run `npm start` to get to work.

## Sass

This repo comes preconfigured to support Sass.  As you can see, at Keen, we generally split out components to include their own Sass files - but you can structure your project however you'd like.

## Caching API responses on the server side

We use Redux both on the server and the client to cache the site content provided by Wordpress in memory.  This is a very simple approach but it works quite well in practice.  The first time a client requests a server rendered copy of a page, Node serves the contents of the `build` folder, without waiting for the asynchronous calls to the WP REST API.  But, this first call populates the in-memory Redux store - therefore any consecutive requests by clients to the same server rendered page will automatically pull from the Redux store - and will automatically populate the data from WP.

## Template Usage

Keen relies on Wordpress page templates to assign ACF custom fields to pages as needed.  For example, a Homepage will generally require different custom fields than a typical About page.  By creating empty templates in the `/api/wp-content/themes/rest-api` folder, we can assign them to pages we create within Wordpress.  We then can write ACF logic to apply custom field groups to pages that use specific page templates, and then we can mirror the same template structure on the client side, but built with React components.

## Credits

To build this repo, we've relied heavily on a few very helpful Medium posts from Andrei Duca:

https://medium.com/bucharestjs/upgrading-a-create-react-app-project-to-a-ssr-code-splitting-setup-9da57df2040a
https://medium.com/bucharestjs/adding-state-management-with-redux-in-a-cra-srr-project-9798d74dbb3b

Also, we've taken inspiration from Postlight's Next.JS + Wordpress setup:

https://github.com/postlight/headless-wp-starter

## Questions?

[Email us](mailto:info@keen-studio.com) or drop by our website at [keen-studio.com](https://keen-studio.com) and say hi through our live chat + live webcam.
