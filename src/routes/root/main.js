module.exports = (app) => {
  app.get('/', function(req, res) {

    const infoPage = {
      pageTitle: 'Welcome',
      title: 'Hello World!',
      text: 'This is my first Express page.',
    }
    
    res.render('index', infoPage)
    
  })
}