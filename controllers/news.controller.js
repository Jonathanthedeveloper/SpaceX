const Post = require("../models/news.model");


class NewsHandler {

    async showNews(req, res) {
        const posts = Post.find({}, function (err, posts) {
            res.render("news", {
                posts: posts,
            });
        });
    };


    renderCompose(req, res) {
        res.render("compose");
    };

    async collectNewPost(req, res) {
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

    async renderIndividualNews(req, res) {
        const requestedPostId = req.params.postId;

        Post.findOne({ _id: requestedPostId }, function (err, post) {
            res.render("post", {
                title: post.title,
                content: post.content,
            });
        });
    };
}

module.exports = new NewsHandler()