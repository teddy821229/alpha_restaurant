const express = require("express")
const app = express()
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const Restaurant = require("./models/restaurant")
const restaurant = require("./models/restaurant")
const port = 3000

//db connection
mongoose.connect("mongodb://localhost/restaurant-list", { useNewUrlParser: true , useUnifiedTopology: true})
const db = mongoose.connection
//db checked
db.on("error", () => {
    console.log("mongodb ERROR")
})
db.once("open", () => {
    console.log("mongodb CONNECTED!")
})

//express template engine
app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine", "handlebars")

//setting static files
app.use(express.static("public"))

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true}))

//route setting
app.get("/", (req, res) => {
    Restaurant.find()
        .lean()
        .then(restaurants => res.render("index", {restaurants}))
        .catch(error => console.error(error))
})

//params
app.get("/restaurant/:restaurant_id", (req, res)=> {
    const id = req.params.restaurant_id
    Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render("show", {restaurant}))
        .catch(error => console.error(error))
})

// //search -> querystring
// app.get("/search", (req, res) => {
//     Restaurant.find()
//         .lean()

//     const restaurants = restaurantList.results.filter((restaurant) => {
//         return restaurant.name.toLocaleLowerCase().includes(req.query.keyword.toLocaleLowerCase()) || restaurant.category.toLocaleLowerCase().includes(req.query.keyword.toLocaleLowerCase())
//     })
//     res.render("index", {restaurants:restaurants, keyword:req.query.keyword})
// })

//修改功能
//渲染畫面
app.get("/restaurant/:restaurant_id/edit", (req, res) => {
    const id = req.params.restaurant_id
    Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render("edit", {restaurant}))
    .catch(error => console.error(error))
})

//儲存修改資料
app.post("/restaurant/:restaurant_id/edit/update", (req, res) => {
    const id = req.params.restaurant_id
    const name = req.body.name
    const name_en = req.body.name_en
    const category = req.body.category
    const image = req.body.image
    const location = req.body.location
    const phone = req.body.phone
    const google_map = req.body.google_map
    const rating = req.body.rating
    const description = req.body.description
    return Restaurant.findById(id)
        .then(restaurant => {
            restaurant.name = name
            restaurant.name_en = name_en
            restaurant.category = category
            restaurant.image = image
            restaurant.location = location
            restaurant.phone = phone
            restaurant.google_map = google_map
            restaurant.rating = rating
            restaurant.description = description
            return restaurant.save()
        })
        .then(() => res.redirect(`/restaurant/${id}`))
        .catch(error => console.error(error))

})

//刪除資料
app.post("/restaurant/:restaurant_id/delete", (req, res) => {
    const id = req.params.restaurant_id
    return Restaurant.findById(id)
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect("/"))
        .catch(error => console.error(error))
})

//start
app.listen(port, () => {
    console.log(`Express is listening on localhost: ${port}`)
})