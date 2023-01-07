module.exports = (app) => {
  app.delete('/posts/:slugg', (req, res) => {
    const Post = require('../../models/Post.js')

    const slugg = req.params.slugg

    return Post.findOne({slugg}).then((post) => {

      return Post.deleteOne({slugg}).then(({ deletedCount }) => {
        res.json({message: `${deletedCount} post(s) deleted`, data: post})
      
      })
      
    }).catch(err => {
      const message = `The post has not been deleted. Please try later.`
      
      res.status(500).json({ message: message, data: err })
      
    })
    
  })
}