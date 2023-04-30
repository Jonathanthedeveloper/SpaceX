const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
// const helmet = require('helmet')



const rootRoute = require('./routes/rootRoute.route');
const notFoundRoute = require('./routes/notfound.route')
const { PORT } = require('./config')

const app = express();



// configurations
app.set("view engine", "ejs");

if (process.env.NODE_ENV === "development") {
    // app.use(morgan("dev"));

    app.set("view cache", false);
}
// app.use(helmet({
//     contentSecurityPolicy: false,
//     frameguard: false
// }))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(express.static("public"));

// Express Flash
app.use("/", function (req, res, next) {
    const message = req.flash();
    res.locals.message = message;
    console.log("why", message)
    next()
})
app.use('/', rootRoute);
app.use('*', notFoundRoute)



// so that mongoose no go disturb my ear with deprecation warning
mongoose.set('strictQuery', true)


// connecting to mongoose

mongoose.connect(process.env.URI)
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Something went wrong while connecting to database: " + error))





app.listen(PORT, function () {
    console.log(`Server listening on http://127.0.0.1:${PORT}`);
})


// You have some issues, leave this blog section alone ooh
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const postSchema = {
    title: String,
    content: String,
  };
  
  const Post = mongoose.model("Post", postSchema);

  app.get("/news", async function (req, res) {
    const posts = Post.find({}, function (err, posts) {
      res.render("news", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    });
  });

  app.get("/news/compose", function (req, res) {
    res.render("compose");
  });
  
  app.post("/news/compose", function (req, res) {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
    });
  
    post
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  app.get("/posts/:postId", function (req, res) {
    const requestedPostId = req.params.postId;
  
    Post.findOne({ _id: requestedPostId }, function (err, post) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    });
  });