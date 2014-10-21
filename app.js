var express = require("express"),
app = express(),
methodOverride = require('method-override'),
bodyParser = require("body-parser"),
db = require("./models/index");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//Home
app.get('/', function(req, res){
  res.render('home');
});


///////////////// AUTHOR ROUTES  ///////////////////

//Index
app.get('/authors', function(req, res){
  db.Author.findAll().success(function(author){
    res.render('author/index', {allAuthors: author});
  });
});

//New
app.get('/authors/new', function(req, res){
  res.render("author/new");
});

//Create
app.post('/authors', function(req, res) {
  var name = req.body.author.name;
  var age = req.body.author.age;
  db.Author.create({
    name: name,
    age: age
  }).success(function(){
    res.redirect('/authors');
  });
});

//Show
app.get('/authors/:id/posts', function(req, res) {
  db.Author.find(req.params.id).done(function(err,author){
    author.getPosts().done(function(err,posts){
      res.render('author/show', {allPosts: posts, author:author});
    });
  });
});

//Edit
app.get('/authors/:id/edit', function(req, res) {
  //find our author
  var id = req.params.id;
  db.Author.find(id).success(function(author){
    res.render('author/edit', {author: author});
  });
});

//Update
app.put('/authors/:id', function(req, res) {
  var id = req.params.id;
  db.Author.find(id).success(function(author){
    author.updateAttributes({
      name: req.body.author.name,
      bio: req.body.author.bio
    }).success(function(){
      res.redirect('/authors');
    });
  });
});

//Delete
app.delete('/authors/:id', function(req, res) {
  var id = req.params.id;
  db.Author.find(id).success(function(author){
    db.Post.destroy({
      where: {
        AuthorId: author.id
      }
    }).success(function(){
      author.destroy().success(function(){
        res.redirect('/authors');
        });
      });
    });
  });

//////// POSTS ROUTES ////////////

//Index
app.get('/posts', function(req, res){
  db.Post.findAll().done(function(err,posts){
    res.render('library/index', {allPosts: posts});
  });
});

//New
app.get('/posts/:id/new', function(req, res){
  var id = req.params.id;
  res.render("library/new", {id:id, title:"",content:""});
});

//Create
app.post('/posts/:id', function(req, res) {
  var AuthorId = req.params.id;
  var title = req.body.post.title;
  var content = req.body.post.content;

  db.Post.create({
    title: title,
    content:content,
    AuthorId: AuthorId
  }).done(function(err,success){
    if(err) {
      var errMsg = "title must be at least 6 characters";
      res.render('library/new',{errMsg:errMsg, id:AuthorId, title:title, content:content});
    }
    else{
      res.redirect('/authors/' + AuthorId + '/posts');
    }
  });
});

//Show
app.get('/posts/:id', function(req, res) {
  db.Post.find(req.params.id).done(function(err,post){
    res.render('library/show', {post: post});
  });
});

//Edit
app.get('/posts/:id/edit', function(req, res) {
  //find our book
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    res.render('library/edit', {post: post});
  });
});

//Update
app.put('/posts/:id', function(req, res) {
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    post.getAuthor().success(function(author){
      console.log(author);
      post.updateAttributes({
      title: req.body.post.title,
      content: req.body.post.content
    }).done(function(err,success){

      if(err) {
        var errMsg = "title must be at least 6 characters";
        res.render('library/edit',{post: post, errMsg:errMsg});
      }
      else{
        res.redirect('/authors/' + author.id + '/posts');
      }
     });
    });
  });
});

//Delete
app.delete('/posts/:id', function(req, res) {
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    post.getAuthor().done(function(err,author){
      post.destroy().done(function(err,success){
        res.redirect('/authors/' + author.id + '/posts');
      });
    });
  });
});

app.get('*', function(req,res){
  res.render('404');
});

app.listen(3000, function(){
  "Server is listening on port 3000";
});
