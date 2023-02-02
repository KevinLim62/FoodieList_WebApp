//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const lodash = require("lodash");
//import {price_range, food_available, food_cuisine} from 'index.js';

 const price_range = [
  {name:'Cheap $'},
  {name:'Normal $$'},
  {name:'Expensive $$$'}
    ];

 const food_available = [
  {name:'Breakfast'},
  {name:'Lunch'},
  {name:'Dinner'}
    ];

 const food_cuisine = [
  {name:'Malay'},
  {name:'Chinese'},
  {name:'Indian'},
  {name:'Nyonya'},
  {name:'Eurasian'},
  {name:'Western'},
  {name:'Thai'},
  {name:'Japanese'},
  {name:'Korean'},
  {name:'Vietnamese'},
  {name:'Arabic'}
    ];

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Database setting (MongoDB - NoSQL)
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1/FoodieListDB');



const FoodInfoSchema = {
  name: String,
};

const FoodItemSchema = {
  name: String,
  price: String,
  location: String,
  availability: Array,
  cuisine: String,
  option: String,
  comments: String
};

const FoodCuisine = mongoose.model("foodcuisine", FoodInfoSchema);
const FoodPrice = mongoose.model("foodprice", FoodInfoSchema);
const FoodAvailability = mongoose.model("foodavailability", FoodInfoSchema);
const FoodItems = mongoose.model("Fooditem", FoodItemSchema);

 async function getFoodieLists(modelname,query) {
   const items = await modelname.find(query);
   return items;
 }

 const items_initialize = async (model1,model2,model3) => {

   if(model1.length === 0)
   {
     FoodCuisine.insertMany(food_cuisine,(err,docs)=>{
       if(err){
         console.log("Food cuisine data failed uploaded");
       }
     });
   }

   if(model2.length === 0)
   {
     FoodPrice.insertMany(price_range,(err,docs)=>{
       if(err){
         console.log("Food price data failed uploaded");
       }
     });
   }

   if(model3.length === 0)
   {
     FoodAvailability.insertMany(food_available,(err,docs)=>{
       if(err){
         console.log("Food availability data failed uploaded");
       }
     });
   }
 }

app.get("/",async function(req,res){

  const cuisine_items = await getFoodieLists(FoodCuisine,{});
  const price_items = await getFoodieLists(FoodPrice,{});
  const availability_items = await getFoodieLists(FoodAvailability,{});
  items_initialize(cuisine_items,price_items,availability_items);

      FoodItems.find({},function(err,food_items){

        res.render("home",{
          Price_Range: price_items,
          Food_Available : availability_items,
          Food_Cuisine: cuisine_items,
          FoodItem: food_items
        });

      })
})


app.get("/hashtag", async function(req,res){

  const cuisineItem = await getFoodieLists(FoodCuisine,{});
  const price_items = await getFoodieLists(FoodPrice,{});
  const availability_items = await getFoodieLists(FoodAvailability,{});

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
  const items = await getFoodieLists(FoodItems,query_string);
  res.render("item",{
     LinkItem: items
  });
})



app.get("/link/:id",function(req,res){

  let itemID = req.params.id;
  FoodItems.findById(itemID,function(err,founditems){
      if(err)
      {
        res.redirect("/");
      }
      else
      {
          res.render("item",{
             LinkItem: founditems
          });
      }
  });

})

app.post("/",function(req,res){

  const info1 = req.body.NamePlace;
  const info2 = req.body.PriceRange;
  const info3 = req.body.NameLocation;
  const info4 = req.body.FoodSelect;
  const info5 = req.body.FoodCuisine;
  const info6 = req.body.options;
  const info7 = req.body.comments;

  const Fooditem = new FoodItems ({
    name: info1,
    price: info2,
    location: info3,
    availability: info4,
    cuisine: info5,
    option: info6,
    comments: info7
  })

  Fooditem.save();

  res.redirect("/");
})


app.listen(3000, function(){
  console.log("Server has started!");
})