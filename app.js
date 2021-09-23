require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnect = require("./db");

app.use(Express.json());

const controllers = require("./controllers");

app.use("/user", controllers.userController);
app.use(require("./middleware/jwtValid"));
app.use("/concerts", controllers.concertController);
app.use("/comment", controllers.commentController);

dbConnect.authenticate()
    .then(()=>dbConnect.sync())
    .then(()=>{
        app.listen(3000, ()=>{
            console.log(`[Server]: App is listening on 3000.`);
    });
})
.catch((err)=>{
    console.log(`[Server]: Server crashed. Error=${err}`);
});