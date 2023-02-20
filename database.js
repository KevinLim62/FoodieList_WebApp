const mongoose = require("mongoose");

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

 module.exports.FoodCuisine = FoodCuisine;
 module.exports.FoodPrice = FoodPrice;
 module.exports.FoodAvailability = FoodAvailability;
 module.exports.FoodItems = FoodItems;

 module.exports.getFoodieLists =  async (modelname,query,limit,skip) => {
    const items = await modelname.find(query).limit(limit).skip(skip);
    return items;
  };

module.exports.items_initialize = async (model1,model2,model3) => {

  if(model1.length === 0)
  {
    FoodCuisine.insertMany(text.food_cuisine,(err,docs)=>{
      if(err){
        console.log("Food cuisine data failed uploaded");
      }
    });
  }

  if(model2.length === 0)
  {
    FoodPrice.insertMany(text.price_range,(err,docs)=>{
      if(err){
        console.log("Food price data failed uploaded");
      }
    });
  }

  if(model3.length === 0)
  {
    FoodAvailability.insertMany(text.food_available,(err,docs)=>{
      if(err){
        console.log("Food availability data failed uploaded");
      }
    });
  }
}
