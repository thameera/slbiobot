var express = require('express'),
    lessMiddleware = require('less-middleware'),
    diffHandler = require('./diffHandler').diffHandler;

var app = express();

app.use(express.logger());

app.set('views', __dirname + '/src/views');
app.set('view engine', 'jade');

app.configure(function() {
  app.use(lessMiddleware({
    dest: __dirname + '/public/stylesheets',
    src: __dirname + '/src/less',
    prefix: '/stylesheets',
    compress: true
  }));

  app.use(express.static(__dirname + '/public'));

});

app.get('/d/:user/:oldbio/:newbio', function(req, res) {
  var diff = diffHandler(req.params.oldbio, req.params.newbio);
  var url = '<a href="https://twitter.com/' + req.params.user + '">@' + req.params.user + '</a>';
  res.render('diff',
    { 
      title: req.params.user + ' - ',
      handle: url,
      difftext: diff,
      current: req.params.newbio,
      old: req.params.oldbio 
    }
  )
});

app.get('/about', function(req, res) {
  res.render('about',
    { title: 'About - '}
  )
});

app.get('/faq', function(req, res) {
  res.render('faq',
    { title: 'FAQ - '}
  )
});
 
app.get('/', function(req, res) {
  res.render('home',
    { title: ''}
  )
});

app.get('*', function(req, res) {
  res.render('404', 
    { title: '404 - '}
  )
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on port " + port);
});

