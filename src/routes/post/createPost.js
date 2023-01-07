module.exports = (app) => {

  app.post('/posts/new', (req, res) => {
    const Post = require('../../models/Post.js')

    const post = new Post(req.body)

    return post.save().then((newPost) => {
      res.json({ message: 'new post created', data: newPost })

    }).catch(err => {
      const message = `The post has not been created. Please try later.`

      res.status(500).json({ message, data: err })

    })

  })
}