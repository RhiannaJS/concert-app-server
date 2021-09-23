const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
// const {UserModel} = require("../models/user")
const {models} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const jwtValid = require("../middleware/jwtValid");

router.post("/register", async (req, res)=>{

    let {username, email, password} = req.body.user;
    try{
        await models.UserModel.create({
    // let User = await models.UserModel.create({
        username,
        email,
        password: bcrypt.hashSync(password, 10)
    })
    // added lines 18 & 19 (9/23) if you remove those lines also remove } & ) before the catch
    .then(
        user=>{
    // console.log(User.id)
    let token = jwt.sign({id: user.id}, /*jwtValid,*/ process.env.ITS_OH_SO_QUIET, {expiresIn: "1d"});

    res.status(201).json({
        user: user,
        message: "User registered successfully!",
        sessionToken: `Bearer ${token}`
    });
}
    )   
    } catch (err){
        if(err instanceof UniqueConstraintError){
            res.status(409).json({
                message: "Email already registered",
            });
        } else {
        res.status(500).json({
            message: `Failed to register user: ${err}`,
        });
      };
    };
         
});

router.get("/userinfo", async (req, res)=>{
    try{
        await models.UserModel.findAll({
        include: [
            {
                model: models.CommentModel,
                include: [
                    {
                        model: models.CommentModel
                    }
                ]
            }
        ]
    })
        .then(
            users => {
                res.status(200).json({
                    users: users
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to get users: ${err}`
        });
    };
});

router.post("/login", async (req, res)=>{
    let {username, email, password} = req.body.user;
    try{
    let loginUser = await models.UserModel.findOne({
        where: {
            username: username,
            // email: email,
        },
    });
    if (loginUser){

        let passwordComparison = await bcrypt.compare(password, loginUser.password);

        if (passwordComparison) {

        let token = jwt.sign({id: loginUser.id}, process.env.ITS_OH_SO_QUIET, {expiresIn: "1d"})

    res.status(200).json({
        user: loginUser,
        message: "User has been logged in successfully!",
        sessionToken: token
    });
} else {
    res.status(40).json({
        // password
        message: "Incorrect email or password, try again."
    })
}
} else {
    res.status(401).json({
        message: "Incorrect email or password, try again."
    });
}
    } catch (error) {
        res.status(500).json({
            message: "Failed to log in user."
        })
    }
});

module.exports = router;