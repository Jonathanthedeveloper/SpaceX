const Post = require("../models/news.model");

const homeStartingContent =
  `SpaceX Completes Successful Launch of Crew-2 Mission to International Space Station Elon Musk's space exploration company, SpaceX, has completed the successful launch of its Crew-2 mission to the International Space Station (ISS). The mission, which launched on April 23, 2021, was the second operational flight of SpaceX's Crew Dragon spacecraft and the first to fly with two international partner astronauts from the European Space Agency and the Japan Aerospace Exploration Agency. 
  The Crew-2 mission marks another significant milestone for SpaceX, which has been working to revolutionize space travel and make it more accessible to the public. 
  It also highlights the company's ongoing collaboration with NASA and other international space agencies to advance the cause of space exploration. During the Crew-2 mission, the four-person crew will spend approximately six months aboard the ISS, conducting a variety of scientific experiments and performing maintenance tasks. 
  This will be the longest duration human spaceflight launched from the United States, and it will enable NASA and its partners to gain valuable insights into how the human body reacts to long-duration spaceflight. Overall, the success of the Crew-2 mission is a testament to SpaceX's commitment to innovation and its ability to work collaboratively with others in pursuit of a common goal. As the company continues to push the boundaries of space exploration, it is likely that we will see more groundbreaking achievements in the years to come.`;

class NewsHandler {

    async showNews(req, res) {
        const posts = Post.find({}, function (err, posts) {
            res.render("news", {
              startingContent: homeStartingContent,
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

        Post.findOne({_id: requestedPostId}, function (err, post) {
            res.render("post", {
                title: post.title,
                content: post.content,
            });
        });
    };
}

module.exports = new NewsHandler()