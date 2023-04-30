const Post = require("../models/news.model");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

class NewsHandler {
    
   async showNews(req, res) {
    const posts = Post.find({}, function (err, posts) {
      res.render("news", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    });
  };

 

  async renderCompose (req, res) {
    res.render("compose");
  };
  
  async collectNewPost (req, res) {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
    });
  
    post
      .save()
      .then(() => {
        res.redirect("/news");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  async renderIndividualNews (req, res) {
    const requestedPostId = req.params.postId;
  
    Post.findOne({ _id: requestedPostId }, function (err, post) {
      res.render("post", {
        title: post.title,
        content: post.content,
        requestedPostId: _id,
      });
    });
  };

}

module.exports = new NewsHandler()