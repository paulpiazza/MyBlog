const { http } = require("winston");

module.exports = {

    definition: {

        openapi: "3.0.0",

        info: {
            version: '1.0.0',
            title: 'My Blog',
            description: 'This is an API that allows you to create and store posts. User can have an access and add comments to posts of others.',
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
                    require: ['author, body, slugg, comments'],
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
                    require: ['author, body'],
                    properties: {
                        author: {
                            type: 'string',
                            description: 'the author of the comment'
                        },
                        body: {
                            type: 'string',
                            description: "The content of the comment. May content some html tags."
                        },
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