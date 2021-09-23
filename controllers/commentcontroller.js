const router = require("express").Router();
const {models} = require("../models");

router.post("/comment/:postId", async (req, res)=>{
    const {content} = req.body.comment;
    const {postId} = req.params

    try{
        await models.CommentModel.create({
            content: content,
            // postId: postId,
            userId: req.user.id,
            concertId: postId
        })
        .then(
            comment=>{
                res.status(201).json({
                    comment: comment,
                    message: "Comment successfully created!"
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create comment: ${err}`
        });
    };

});

module.exports = router;