const { http } = require("winston");

module.exports = {

    definition: {

        openapi: "3.0.0",

        info: {
            version: '1.0.0',
            title: 'My Blog',
            description: '<b>Getting Started : </b> ' +
                'This API allows users to manage and store posts. Other users of the API can add comments on your post. ' +
                'Get starting by creating an account : <a href="#/Users/post_users_new">/users/new (Sign In)</a> ' +
                'Then you can get your token by posting your credentials here : <a href="#/Users/post_users_login">/users/login (Log In)</a> ' +
                'Copy and paste your token in the authorization form : <a href=".authorize">Authorize</a>',
            license: {
                name: 'Copyrights, Paul Piazza',
            },
        },


        servers: [
            {
                url: 'http://localhost:3500',
                description: 'Development server'
            }
        ],


        components: {

            schemas: {

                Post: {
                    type: 'object',
                    require: ['body', 'slugg'],
                    properties: {
                        slugg: {
                            type: 'string',
                            description: "The title of the post. It's sluggified and unique."
                        },
                        body: {
                            type: 'string',
                            description: "The content of the post. May content some html tags."
                        }
                    },
                },

                Comment: {
                    type: 'object',
                    require: ['body'],
                    properties: {
                        body: {
                            type: 'string',
                            description: "The content of the comment. May content some html tags."
                        },
                    }
                },

                User: {
                    type: 'object',
                    require: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            description: 'The email is the Login of the user.'
                        },
                        password: {
                            type: 'string',
                            description: 'The password of the account.'
                        }
                    }
                }
            },

            responses: {
                400: {
                    description: "Missing API key. Include in the Authorization header.",
                    contents: "application/json"
                },

                401: {
                    description: "Not found.",
                    contents: "application/json"
                },

                404: {
                    description: "Unauthorized.",
                    contents: "application/json"
                },

                500: {
                    description: "internal error",
                    contents: "application/json"
                }
            },

            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },

            security: [
                {
                    bearerAuth: []
                }
            ],
        },

    },

    apis: ['src/routes/**/*.js'],

}