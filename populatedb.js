#! /usr/bin/env node

console.log(
  'This script populates some test categories, and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createitems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the Fantasy category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}



async function itemCreate(index, name, description, price, number_in_stock, category) {
  const itemdetail = {
    name: name,
    description: description,
    number_in_stock: number_in_stock,
    price: price,
  };
  if (category != false) itemdetail.category = category;

  const item = new Item(itemdetail);
  await item.save();
  //items[index] = item;
  console.log(`Added item: ${name}`);
}



async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Laptops", 'top of the line personal computers'),
    categoryCreate(1, "Phones", 'the latest smartphones'),
    categoryCreate(2, "Gaming", 'brand new and open box gaming consoles'),
  ]);
}


async function createitems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(0,
      "Microsoft - Xbox Series X 1TB Console - Black",
      "Xbox Series X, the fastest, most powerful Xbox ever. Explore rich new worlds with 12 teraflops of raw graphic processing power, DirectX ray tracing, a custom SSD, and 4K gaming. Make the most of every gaming minute with Quick Resume, lightning-fast load times, and gameplay of up to 120 FPS—all powered by Xbox Velocity Architecture.",
      499.99,
      10,
      [categories[2]]
    ),
    itemCreate(1,
      "Microsoft - Xbox Wireless Controller for Xbox Series  - Carbon Black",
      "Experience the modernized design of the Xbox Wireless Controller in Carbon Black, featuring sculpted surfaces and refined geometry for enhanced comfort during gameplay with battery usage up to 40 hours.",
      59.99,
      25,
      [categories[2]]
    ),
    itemCreate(2,
      "Microsoft - Xbox Game Pass Ultimate - 3-Month Membership [Digital]",
      "Be the first to play new games like Starfield and Forza Motorsport on day one so you never miss a thing and enjoy hundreds of high-quality games like Minecraft Legends and more with Xbox Game Pass Ultimate.",
      49.99,
      100,
      [categories[2]]
    ),
    itemCreate(3,
      "Microsoft - Rechargeable Battery + USB-C Cable for Xbox Series - Black",
      "Keep the action going with the Xbox Rechargeable Battery + USB-C Cable. Recharge while you play or afterwards, even when your Xbox is in standby. ",
      24.99,
      15,
      [categories[2]]
    ),
    itemCreate(4,
      "Lenovo - Flex 5i 14\" FHD Touchscreen Laptop - Intel Core i5-1235U with 8 GB Memory - Intel Iris Xe Graphics - 512GB SSD - Storm Grey",
      "With a 360° drop-down hinge that lifts up the keyboard for easier typing and more screen, the Lenovo IdeaPad Flex 5i adapts to whatever you’re doing for limitless creation and performance on the 12th Generation Intel Core i5 processors and Intel Iris Xe graphics. Watch your entertainment come to life on an 1920 x 1200 FHD display with and 90% AAR for a taller, boundless screen. ",
      699.99,
      200,
      [categories[0]]
    ),
    itemCreate(5,
      "Razer - Blade 16 - 16'' Gaming Laptop - QHD+ 240 Hz - Intel 24-Core i9-13950HX - NVIDIA GeForce RTX 4070 - 16GB RAM - 1TB SSD - Black",
      "Experience insane performance and ultra-portability with the Razer Blade 16—featuring more graphics power per inch than any other 16” gaming laptop and witness quality you can’t unsee with QHD+240 Hz display. ",
      2199.99,
      10,
      [categories[0], categories[2]]
    ),
    itemCreate(6,
      "Apple - iPhone 15 Pro 256GB - Natural Titanium (AT&T)",
      "iPhone 15 Pro. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system. ",
      1099.99,
      200,
      [categories[1]]
    ),
    itemCreate(7,
      "Test Book 2",
      "Summary of test book 2",
      123,
      2000,
      false,
    ),
  ]);
}


