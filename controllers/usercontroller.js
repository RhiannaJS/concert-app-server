const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
// const {UserModel} = require("../models/user")
const {models} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res)=>{

    let {username, email, password} = req.body.user;
    try{
        // await models.UserModel.create({
    let User = await models.UserModel.create({
        username,
        email,
        password: bcrypt.hashSync(password, 10)
    })
    // added lines 18 & 19 (9/23) if you remove those lines also remove } & ) before the catch
    // .then(
    //     user=>{
    console.log(User.id)
    let token = jwt.sign({id: User.id}, process.env.ITS_OH_SO_QUIET, {expiresIn: "1d"});

    res.status(201).json({
        user: User,
        message: "User registered successfully!",
        sessionToken: token
    });
// }
//     )   
    } catch (err){
        if(err instanceof UniqueConstraintError){
            res.status(409).json({
                message: "Email already registered",
            });
        } else{
        res.status(500).json({
            message: `Failed to register user: ${err}`,
        });
      }
    }
         
});

router.post("/login", async (req, res)=>{
    let {username, email, password} = req.body.user;
    try{
    let loginUser = await UserModel.findOne({
        where: {
            username: username,
            email: email,
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
    res.status(401).json({
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