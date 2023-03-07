//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const text = require("./public/constant.js");
const db = require("./public/database.js");

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(express.json());

let search_content = "";

app.get("/",async function(req,res){

  const content_limit = 8;
  const content_skip = req.query.skip? req.query.skip : 0;
  search_content = req.query.search_result;
  //_________________Initializing__________________
  const cuisine_items = await db.getFoodieLists(db.FoodCuisine,{},0,0);
  const price_items = await db.getFoodieLists(db.FoodPrice,{},0,0);
  const availability_items = await db.getFoodieLists(db.FoodAvailability,{},0,0);
  const food_items = await db.getFoodieLists(db.FoodItems,{},0,0);
  //items_initialize(cuisine_items,price_items,availability_items);

  const searched_fooditems = search_content !== undefined? food_items.filter( item => {
       return item.name.includes(search_content);
  }) : food_items;

  const page_num = (searched_fooditems.length)/8 <= 1 ? 0 : Math.floor((searched_fooditems.length)/8);
  const start = Number(content_skip);
  const end = Number(content_skip)+8;
  const display_fooditems = searched_fooditems.slice(start,end);
  //console.log(display_fooditems);
  res.render("home",{
    Price_Range: price_items,
    Food_Available : availability_items,
    Food_Cuisine: cuisine_items,
    FoodItem: display_fooditems,
    Page_num: page_num,
    Search_content: search_content
    });
})

app.get("/hashtag", async function(req,res){

  const cuisineItem = await db.getFoodieLists(db.FoodCuisine,{});
  const price_items = await db.getFoodieLists(db.FoodPrice,{});
  const availability_items = await db.getFoodieLists(db.FoodAvailability,{});

  res.render("hashtag",{
    Food_Cuisine: cuisineItem,
    Price_Range: price_items,
    Food_Available : availability_items
  });
})


app.get("/hashtag/:ItemType/:ItemName", async function(req,res){

  const query_string = {};
  const itemType = req.params.ItemType;
  const itemName = req.params.ItemName;
  query_string[itemType] = itemName;
  const items = await db.getFoodieLists(db.FoodItems,query_string);

  const comments = items.length>0? `Found ${items.length} Places`:"No Food Place Was Found...";

  res.render("item",{
     LinkItem: items,
     Comments: comments
  });
})



app.get("/link/:id",function(req,res){

  let itemID = req.params.id;
  db.FoodItems.findById(itemID,function(err,founditems){
      if(!err)
      {
        res.render("item",{
           LinkItem: founditems
        });
      }
  });

})

app.post("/",function(req,res){

  const content = req.body;
  const Fooditem = new db.FoodItems ({
    name: content.NamePlace,
    price: content.PriceRange,
    location: content.NameLocation,
    availability: content.FoodSelect,
    cuisine: content.FoodCuisine,
    option: content.options,
    comments: content.comments
  })

  Fooditem.save();

  res.redirect("/");
})

app.post("/delete",function(req,res){

  const deleteditem_id = req.body.deleteditem_id;
  console.log(deleteditem_id);
  db.FoodItems.findByIdAndRemove(deleteditem_id, function(err,founditems){
    if (!err)
    {
      console.log("Item was successfully deleted!");
    }
  });

  res.redirect("/");
})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server has started!");
})
