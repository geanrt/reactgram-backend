/* eslint-disable no-undef */
// eslint-disable-next-line no-undef


const express = require("express")
const router  = express()

router.use("/api/users", require("./UserRoutes"))
router.use("/api/photos", require("./PhotoRoutes"))
// Rotas aqui
router.get("/", (req, res)=>{
    res.send("API WORKING")
})

module.exports = router

