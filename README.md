# Minimal JWT exercise:

A simple API running in [heroku](https://server-d-task.herokuapp.com/). It was created as the backend for (this project)[https://github.com/anibalmgr/cra-app]

### If you want to start the api locally:

1. Create a free Atlas Cluster [following this guide](https://www.mongodb.com/docs/atlas/getting-started/?_ga=2.114433351.13171983.1654950417-842438818.1654950416)

2. create an .env file:

    PORT=5000
    MONGO_URI="your_mongo_uri_after_creating_your_free_atlas_cluster"
    TOKEN_KEY="anyarray"
    CLIENT="http://localhost:3000"

3. To start your app from root:

    node app.js




Follow this tutorial from [here](https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/#step-6---implement-register-and-login-functionality)

Another good guide is [React Authentication: How to Store JWT in a Cookie](https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81)

and [Using Cookies with JWT in Node.js](https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn) by [Francisco Mendes](https://dev.to/franciscomendes10866)
