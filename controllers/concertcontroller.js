const Express = require("express");
const router = Express.Router();
let jwtValid = require("../middleware/jwtValid");
// will this be ("../models") or ("../models/concert")
const {models} = require("../models")

router.get("/practice", jwtValid, (req, res)=>{
    res.send("Hey!! This is a practice route!")
});

router.post("/create",  async (req, res)=>{
    const {bandName, openingAct, dateAttended, location, description, comment} = req.body.concert;
    // const {id} = req.user;
    // const concertEntry = {
    //     bandName,
    //     openingAct,
    //     dateAttended, 
    //     location,
    //     description, 
    //     comment,
    //     owner: id
    // }
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
            // should this be post and not create?
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
//     try{
//         const newConcert = await ConcertModel.create(concertEntry);
//         res.status(200).json(newConcert);
//     } catch (err) {
//         res.status(500).json({error:err});
//     }
//     ConcertModel.create(concertEntry)
});


module.exports = router;