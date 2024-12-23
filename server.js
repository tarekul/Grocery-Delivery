const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database
const db = new sqlite3.Database('./grocery.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

// Create tables
db.run(`
    Create table if not exists orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        address TEXT,
        items TEXT,
        total_price REAL
    )`);

// Inventory
const inventory = {
    Grains: [
        { id: 2, name: 'Royal Basmati Rice - 20LB', price: 23.99, image: 'https://i5.walmartimages.com/seo/Royal-Basmati-Rice-20-lbs_5e36c1d4-2801-4fc9-a521-9533430cbb15.1522ee5c836524979f6c8ebb3959a747.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF', category: 'Grains' },
        { id: 4, name: 'Krishok Basmati Rice - 20LB', price: 23.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvalNGYzJlYXR1Mk1ndXdzMHczZ1JFZHl5TGt0NmpJNTlPdXNOWnRKRi5qcGcifQ==', category: 'Grains' },
        { id: 5, name: 'Deshi Kalijira rice- 10LB', price: 21.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvdXZ0U3RrSDRjQmdvRk00YUhtR1V2NWUzYUdvbWVTVmpncTV1VjVlZS5qcGcifQ==', category: 'Grains' }, 
        { id: 9, name: 'Kohinoor Extra Fine Basmati Rice - 20lbs', price: 29.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvanBOajZvdlEwRVhhVzVpUVpDZzhxc1NlZXJIdVpHU2JSQkNtUHRhdi5qcGcifQ==', category: 'Grains' },
        { id: 10, name: 'Rice Flour - 2LB', price: 1.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvUk14eGNDMEV2aEw2SkxzRjU2emRFZDJaeWFIRTVSS0tjYUh2a1lNSy5qcGcifQ==', category: 'Grains' },
        { id: 14, name: 'Abdullah Premium Parboiled Quality Rice - 20 LBS', price: 18, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvZGtlQWo1d0QyZU95eVBsNDJET251NmNFY0FKTUVRU0hmcmQwMjdUVS5qcGcifQ==', category: 'Grains' },
        { id: 68, name: 'Dunar Elonga Long Basmati Rice - 10 lb', price: 19.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvNW1EeVBsdVBPUmNkUjZ3d2JUNE4wOWNheXpIa1E1dzh4NlZBalBkZi5qcGcifQ==', category: 'Grains' },
    ],
    Lentils: [
        { id: 6, name: 'Masoor Dal- 4LB', price: 5.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvMDZ3NzQ4Z0ZzOFVhaEJTbXM5VFR3dUxOUWRrcE9NeXhmR1NIRWVNci5qcGcifQ==', category: 'Lentils' },
        { id: 7, name: 'Moog Dal - 4LB', price: 5.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMva1l6dUlTT2s4NHgwQ05mYUVOdDltWUJCb0dRRTB0NkFTMW9HczQ1by5qcGcifQ==', category: 'Lentils' },
        { id: 8, name: 'White Chana - 2LB ', price: 5.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvY25LbGhJSnpWbkJWRXowV2lOd0ZYcmV2OHRnRjQ2ck90OGZ4elB5RS5qcGcifQ==', category: 'Lentils' },
        { id: 11, name: 'Moog Dal - 2LB', price: 1.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvWFMxZzVuYkFVRmhFTnY5VjlLVndwdmQ5cURpUDZkcWRJTU41cTZYTy5qcGcifQ==', category: 'Lentils' },
        { id: 12, name: 'Deshi Chana Dal - 4LB', price: 5.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvdlZkOVNoVmVDUzJkVDlaU1AxcjRYcmdYclViVVRzVWYyYUtzVnFTVi5qcGcifQ==', category: 'Lentils' },
        { id: 13, name: 'Fried Khesari Dal - 2LB', price: 4.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMveDlUYnVaUTBFTTZlVThtRWZOM0w2Y1dVMjVQT2Jwd0VmT1ZZc2t2RC5qcGcifQ==', category: 'Lentils' },
        { id: 18, name: 'Urad Dal - 4LB', price: 4.99, image: 'https://m.media-amazon.com/images/I/91OdjllU0CL._SL1500_.jpg', category: 'Lentils' },
    ],
    Spices: [
        { id: 24, name: 'Turmeric Powder 7 oz', price: 2.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvMXJTckpFOW1hSGJKYnVtSEtxbjRjZG1zczZQOW9HZUFtR0h4cTgwVC5qcGcifQ==', category: 'Spices' },
        { id: 25, name: 'Yellow Mustard Seed, 7 oz', price: 2.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvQjJ2cjRZZE02cFh6T2ZNQXI5ZmxzdFNKazRpMzVnNGI3RXZrcDluTy5qcGcifQ==', category: 'Spices' },
        { id: 28, name: 'Coriander powder 14 oz', price: 4.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvdHk2Ump1cTdEVVQ4YTlweXBtRVp6TFRhdnNnaDlGWlM4dHdrbkRxQS5qcGcifQ==', category: 'Spices' },
        { id: 30, name: 'Chilli Powder 500 grams', price: 5.99, image: 'https://www.abanifoods.com/cdn/shop/products/102-05RadhuniChiliPowder17.64oz_1024x1024.jpg?v=1589076628', category: 'Spices' },
        { id: 31, name: 'Lalah\'\s Madras Curry Powder', price: 4.49, image: 'https://www.abanifoods.com/cdn/shop/products/102-03Lalah_sMadrasCurryPowder1.36Kg48oz_540x.jpg?v=1589059492', category: 'Spices' },
        { id: 32, name: 'Garlic Powder 7 oz', price: 2.99, image: 'https://www.abanifoods.com/cdn/shop/products/SWADGarlicPowder7oz_1024x1024.png?v=1656689752', category: 'Spices' },
        { id: 33, name: 'Whole Black Pepper 7 oz', price: 5.99, image: 'https://www.abanifoods.com/cdn/shop/products/102-21SwadWholeBlackPepper7oz_1024x1024.jpg?v=1589148914', category: 'Spices' },
        { id: 34, name: 'White Sesame Seeds 7 oz', price: 2.99, image: 'https://www.abanifoods.com/cdn/shop/products/102-28ShadWhiteSesameSeeds7oz_1024x1024.jpg?v=1589191996', category: 'Spices' }
    ],
    'Cooking Essentials': [
        { id: 63, name: 'Pure Mustard Oil - 1 Liter', price: 7.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvN0JyYzJ5UVdVVkV6am5Ka0V1dE01c2pUVE51R01wRGNma2I3bWxuei5qcGcifQ==', category: 'Cooking Essentials' },
        { id: 64, name: 'Vridavan Pure Cow Ghee 8oz', price: 7.69, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvM3VjZ2dieEd0ejBXdkd2Q0ZvQ1dqa2xvZ0ZwZ2VJcmJsMldUWmJkWS5qcGcifQ==', category: 'Cooking Essentials' },
        { id: 65, name: 'Corn Oil 1.42 L', price: 3.49, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvQjFPdFRtRmo3T2dZNlFtWWV6VklZY0VUMEpKeUE0a3Fmd0RBRGJmQS5qcGcifQ==', category: 'Cooking Essentials' },
        { id: 66, name: 'Vridavan Pure Cow Ghee 32oz', price: 24.19, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvaVhXYUw0R1hEM25lamhmUmJPQmFnR1BEc0w1S21tTWdiSDhFaW5uSi5qcGcifQ==', category: 'Cooking Essentials' },
        { id: 67, name: 'Mazola Corn Oil - 96oz', price: 16.49, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvUFA3UWphRzJ3YWlnVGx3V0s3d3JyQXFsME12WDBEcnVBZXBwNFZvbS5qcGVnIn0=', category: 'Cooking Essentials' },
        { id: 67, name: 'Mazola Corn Oil - 40oz', price: 8.02, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvV1V5NGM5UFdZS1Z2TDVCNlhlMzB2c0VTenBuZDhaemlDd1JOT2xNUC5qcGVnIn0=', category: 'Cooking Essentials' },
    ],
    'Ready-to-Cook': [
        { id: 106, name: 'Beef Masala', price: 1.99, image: 'https://www.abanifoods.com/cdn/shop/products/RADHUNIBeefMasala100g_1024x1024.png?v=1656803675', category: 'Ready-to-Cook' },
        { id: 107, name: 'Biryani Masala', price: 1.99, image: 'https://www.abanifoods.com/cdn/shop/products/radhunibiranimix_1024x1024.jpg?v=1597478855', category: 'Ready-to-Cook' },
        { id: 108, name: 'Chicken Tandoori Masala', price: 1.99, image: 'https://www.abanifoods.com/cdn/shop/products/Tandurimosla_540x.jpg?v=1597479671', category: 'Ready-to-Cook' },
        { id: 109, name: 'Achar Gosht', price: 1.99, image: 'https://www.abanifoods.com/cdn/shop/products/100-33SHANACHARGOSHT_1024x1024.jpg?v=1585973577', category: 'Ready-to-Cook' },
        { id: 110, name: 'Haleem Mix', price: 1.99, image: 'https://www.abanifoods.com/cdn/shop/products/ShanHaleenmix_1024x1024.jpg?v=1620363189', category: 'Ready-to-Cook' },
        { id: 111, name: 'Chicken Masala', price: 1.99, image: 'https://www.abanifoods.com/cdn/shop/products/100-21SHANCHICKENMASALA_1024x1024.jpg?v=1585864444', category: 'Ready-to-Cook' },
        { id: 128, name: 'Mutton Biryani', price: 1.99, image: 'https://www.abanifoods.com/cdn/shop/products/100-10shanmuttonbiryani_540x.jpg?v=1585991423', category: 'Ready-to-Cook' },
    ],
    'Dairy Products': [
        { id: 112, name: 'Nestle Carnation Evaporated Milk', price: 1.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvS3E5R1BRMm1qN3JYQVMyV2JwaVFVQnlKcVBFcGpEUGtYOFF3Z3IyWi5qcGcifQ==', category: 'Dairy Products' },
        { id: 113, name: 'Borden Magnolia Sweetened Condensed Milk', price: 1.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvN0pYYjRPTWw0WUVqWW4yR0gwbFg0OE1TSUcyaURMcmhCTkYyNXJNZi5qcGcifQ==', category: 'Dairy Products' },
        { id: 114, name: 'Grade A Dozen Jumbo Eggs', price: 4.49, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvck0wSktQWHAzaEZJN0Jpd0hkTThEaDlGTFlQWEZxMlVYQVhOTWxLOS5qcGcifQ==', category: 'Dairy Products' },
        { id: 115, name: 'Dano Full Cream Powder Milk Tin - 400 Grams', price: 7.99, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvZ2ZvYzJySW9CQ1lVdTl2MDAwaDA1dG40ZkEzZDFNb0lXZkhGS01XeC5qcGcifQ==', category: 'Dairy Products' },
        { id: 116, name: 'Whole Milk', price: 3.39, image: 'https://www.instacart.com/image-server/932x932/filters:fill(FFF,true):format(webp)/www.instacart.com/assets/domains/product-image/file/large_1dffbc49-4d36-470e-986c-eb200db575d7.jpg', category: 'Dairy Products' },
        { id: 117, name: 'Whole Milk', price: 2.49, image: 'https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_8ac0e7b7-9611-473a-9149-0761be8edf88.jpg', category: 'Dairy Products' },
    ],
    'Fruits & Vegatables': [
        { id: 121, name: 'Lettuce', price: 2.13, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJoZWlnaHQiOjcyMH0sIndlYnAiOnsicXVhbGl0eSI6NjB9fSwia2V5IjoicHJvZHVjdC1pbWFnZXMvQlVjRkVJdTMzbkxRb1pXZ2d4QzBBcXhPMXByTDlYZjdPUjFtSm1HQy5qcGcifQ==', category: 'Fruits & Dry Fruits' },
        { id: 122, name: 'Apples 1LB', price: 3.20, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MjgwLCJoZWlnaHQiOjE4N319LCJrZXkiOiJwcm9kdWN0LWltYWdlcy95enluZGc0ZjBxbldsWmIxdks4Z3RWNzVPclM0eGdFTlBvanV0Y3BYLmpwZyJ9', category: 'Fruits & Dry Fruits' },
        { id: 123, name: 'Tomatoes 1LB', price: 5.34, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MjgwLCJoZWlnaHQiOjE4N319LCJrZXkiOiJwcm9kdWN0LWltYWdlcy83bVVteE1TYkpNdjViT0tMUEJaRFBmOVc1eVdJWmlFMGluN2l5bTFOLmpwZyJ9', category: 'Fruits & Dry Fruits' },
        { id: 124, name: 'Carrots 1LB', price: 1.38, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MjgwLCJoZWlnaHQiOjE4N319LCJrZXkiOiJwcm9kdWN0LWltYWdlcy8xRGN6Y29GSjQ3VDBRMHVhUlRPVkZBNjN4VWQ2SEh2bmVOYkp4V21tLmpwZyJ9', category: 'Fruits & Dry Fruits' },
        { id: 125, name: 'Banana 1LB', price: 0.95, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MjgwLCJoZWlnaHQiOjE4N319LCJrZXkiOiJwcm9kdWN0LWltYWdlcy9zTjhIUTRYUjJEOEpWd3h0OXZ2UnlUMEdHOEpHSGN4WEhaTVhBZUZGLmpwZyJ9', category: 'Fruits & Dry Fruits' },
        { id: 126, name: 'Celery', price: 1.59, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MjgwLCJoZWlnaHQiOjE4N319LCJrZXkiOiJwcm9kdWN0LWltYWdlcy8zdHFhN2hlbGhzbnZaQXpva2NCNFR1dTNEMXltcExpcGJoZ2ZwM3h6LmpwZyJ9', category: 'Fruits & Dry Fruits' },
        { id: 127, name: 'Red Onions 1LB', price: 3.20, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MjgwLCJoZWlnaHQiOjE4N319LCJrZXkiOiJwcm9kdWN0LWltYWdlcy9wSDE4MmkwQ0RIOXExeFdlMjhNb1lZSUNEOHYwaTRHeFdjTXRxNEFPLmpwZyJ9', category: 'Fruits & Dry Fruits' },
        { id: 128, name: 'White Onions 1LB', price: 2.66, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MjgwLCJoZWlnaHQiOjE4N319LCJrZXkiOiJwcm9kdWN0LWltYWdlcy9yQzFMcTFtMDRNck5TU244d3VDcjJEckpicnBCbGNObFN1d3cxSlFyLmpwZyJ9', category: 'Fruits & Dry Fruits' },
        { id: 129, name: 'Ginger', price: 3.20, image: 'https://d2sg5tibg946xl.cloudfront.net/eyJidWNrZXQiOiJtZXJjYXRvLWltYWdlcyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJpbnNpZGUiLCJ3aWR0aCI6MjgwLCJoZWlnaHQiOjE4N319LCJrZXkiOiJwcm9kdWN0LWltYWdlcy9XMGQxT0h2VDdKQ2hBR3dJU0lWUTNvNnZzMVNNZE9rVFdrV2pJdlI2LmpwZyJ9', category: 'Fruits & Dry Fruits' },
    ]
};

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Grocery MVP App!');
});

app.get('/inventory', (req, res) => {
    try {
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.use('/inventory_images', express.static('inventory_images'));

app.post('/order', (req, res) => {
    const { name, phone, address, items } = req.body;
    const total_price = items.reduce((total, item) => {
        const itemData = Object.values(inventory).flat().find(i => i.id === item.id);
        if (!itemData) {
            return total;
        }

        return total + itemData.price * item.quantity;
    }, 0);

    const sql = `
        INSERT INTO orders (name, phone, address, items, total_price)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [name, phone, address, JSON.stringify(items), total_price], function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).send('Error placing order.');
        } else {
          res.status(201).send('Order placed successfully.');
        }
    });
});

app.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error fetching orders.');
        } else {
            res.json(rows);
        }
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));