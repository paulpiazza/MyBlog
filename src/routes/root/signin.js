module.exports = (app) => {
  app.get('/signin', function(req, res) {

    res.render('signin')

  })
}