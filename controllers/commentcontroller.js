const router = require("express").Router();
const {models} = require("../models");


// POST a comment - WORKING
router.post("/comment/:postId", async (req, res)=>{
    const {content} = req.body.comment;
    const {postId} = req.params;

    try{
        await models.CommentModel.create({
            content: content,
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

// GET comments by user - WORKING
router.get("/mine", async (req, res)=>{
    let userId = req.user.id;
    try{
        const userComments = await models.CommentModel.findAll({
            where: {
                userId: userId
            }
        });
        res.status(200).json(userComments);
    } catch (err) {
        res.status(500).json({error: err})
    }
});

// Update Comment - works
router.put("/comment/update/:commentId", async (req, res)=>{
    const {content} = req.body.comment;
    const {commentId} = req.params;

    const query = {
        where: {
            id: commentId
        }
    };

    const updatedComment = {
        content,
        userId: req.user.id
    };

    try{

     const update = await models.CommentModel.update(updatedComment, query);
    res.status(200).json(update);
} catch (err) {
    res.status(500).json({error: err});
}
});

// DELETE comment - works
router.delete("/comment/delete/:commentId", async (req, res)=>{
    const userId = req.user.id;
    const {commentId} = req.params;

    try{
        const query = {
            where: {
                id: commentId,
                userId: userId
            }
        };
        await models.CommentModel.destroy(query);
        res.status(200).json({message: "Your concert comment was destroyed!"});
    } catch (err) {
        res.status(500).json({error: err});
    };
});

module.exports = router;