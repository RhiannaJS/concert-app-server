const router = require("express").Router();
const {models} = require("../models");

router.post("/comment", async (req, res)=>{
    const {content, postId} = req.body.comment;

    try{
        await models.CommentModel.create({
            content: content,
            postId: postId,
            userId: req.user.id
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