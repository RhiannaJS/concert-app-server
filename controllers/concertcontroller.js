const Express = require("express");
const router = Express.Router();
const {models} = require("../models")
const adminJwtValid = require("../middleware/adminJwtValid")
const jwtValid = require("../middleware/jwtValid")



// POST Concert Create - working
router.post("/create", jwtValid, async (req, res)=>{
    const {bandName, openingAct, dateAttended, location, description, comment} = req.body.concert;

    try{
        await models.ConcertModel.create({
            bandName: bandName,
            openingAct: openingAct,
            dateAttended: dateAttended,
            location: location,
            description: description,
            comment: comment,
            userId: req.user.id
        })
        .then(
            concertCreate => {
                res.status(201).json ({
                    concertCreate: concertCreate,
                    message: "New Concert Expirence created!"
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Could not create new expirence: ${err}`
        });
    };

});

// GET all Concert entries - WORKING
router.get("/all", jwtValid, async (req, res)=>{
    try{
        const shows = await models.ConcertModel.findAll();
        res.status(200).json(shows);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

// GET concerts by user - WORKING
router.get("/mine", jwtValid, async (req, res)=>{
    let userId = req.user.id;
    
    try{
        const userConcerts = await models.ConcertModel.findAll({
            where: {
                userId: userId
            }
        });
        res.status(200).json(userConcerts);
    } catch (err) {
        res.status(500).json({error: err})
    }
});

// UPDATE concert expirence - works
router.put("/update/:entryId", jwtValid, async (req, res)=>{
    const {bandName, openingAct, dateAttended, location, description, comment} = req.body.concert;
    const concertId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: concertId,
            userId: userId
        }
    };

    const updatedConcert = {
            bandName,
            openingAct,
            dateAttended,
            location,
            description,
            comment,
    };

    try{
        const update = await models.ConcertModel.update(updatedConcert, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({error: err});
    };
});

// Admin Update - Working
router.put("/update/admin/:entryId", adminJwtValid, async (req, res)=>{
    const {bandName, openingAct, dateAttended, location, description, comment} = req.body.concert;
    const concertId = req.params.entryId;
    

    const query = {
        where: {
            id: concertId,
            
        }
    };

    const updatedConcert = {
            bandName,
            openingAct,
            dateAttended,
            location,
            description,
            comment,
    };

    try{
        const update = await models.ConcertModel.update(updatedConcert, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({error: err});
    };
});

// DELETE concert experience - WORKS!
router.delete("/delete/:id", jwtValid, async (req, res)=>{
    const userId = req.user.id;
    const concertId = req.params.id;

    try{
        const query = {
            where: {
                id: concertId,
                userId: userId
            }
        };
        await models.ConcertModel.destroy(query);
        res.status(200).json({message: "Your concert experience was destroyed!"});
    } catch (err) {
        res.status(500).json({error: err});
    };
});


module.exports = router;