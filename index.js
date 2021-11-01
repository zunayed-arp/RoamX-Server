const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// tourDb
//OR8xDgyJI7K4KoZt


//middlewire
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ch3vz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		const database = client.db('toursDb');
		const package_collection = database.collection('Package');
		const booking_collection = database.collection('Booking');
		const cart_collection = database.collection('Cart');
		const air_collection = database.collection('Air')
		const services_collection = database.collection('Services');


		app.get('/airticket', async (req, res) => {
			const air_ticket = await air_collection.find({}).toArray();
			// console.log("inside ", packages)
			res.json(air_ticket);
		});

		app.get('/services', async (req, res) => {
			const services_ = await services_collection.find({}).toArray();
			// console.log("inside ", packages)
			res.json(services_);
		});




		// get api,show all packages
		app.get('/packages', async (req, res) => {
			const packages = await package_collection.find({}).toArray();
			// console.log("inside ", packages)
			res.json(packages);
		});
		

		// update a package using id
		app.get('/packages/:id',async(req,res)=>{
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const result =  await package_collection.findOne(query);
			res.json(result);
		})

	
		//load all data from cart
		app.get('/cart', async (req, res) => {
			const packages = await cart_collection.find({}).toArray();
			// console.log("inside ", packages)
			res.json(packages);
		});


		// load from cart based on uid
		app.get('/cart/:uid',async(req,res)=>{
			const uid = req.params.uid;
			const query = {uid: uid};
			const result = await cart_collection.find(query).toArray();
			res.json(result);
		});


		//add new package to the cart
		app.post('/cart/add', async (req, res) => {
			const package = req.body;
			const result = await cart_collection.insertOne(package);
			res.json(result);
		});
		
		

		//add a package
		app.post('/addPackage', async (req, res) => {
			const package = req.body;
			const result = await package_collection.insertOne(package);
			console.log("result", result);
			// console.log(req.body)
			res.json(result);
		});

		//update package 

		app.put('/packages/:id',async(req, res)=>{
			const id = req.params.id
			const updatedService = req.body;
			const filter = {_id: ObjectId(id)};
			const option = {upsert:true};

			const updateDoc = {
				$set: {
					title: updatedService.title, duration: updatedService.duration, rating: updatedService.rating, description: updatedService.description, price: updatedService.price, img: updatedService.img

				},
			};

			const result = await package_collection.updateOne(filter,updateDoc, option);


			console.log('updating',id);

			res.json(result);

		})


		//delete single service

		app.delete('/packages/:id',async(req,res)=>{
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const result = await package_collection.deleteOne(query);
			
			console.log(result)
			// res.send('hitting the server')
			res.json(result);
		})

	 //delete single reserve
		app.delete('/cart_delete/:id',async(req,res)=>{
			const id = req.params.id;
			const query = {_id:ObjectId(id)};
			const result = await cart_collection.deleteOne(query);
			res.json(result);
		})


		//delete all reserve 
		app.delete('/cart_delete_all/:uid',async(req,res)=>{
			const uid = req.params.uid;
			const query = {uid:uid};
			const result = await cart_collection.deleteMany(query);
			res.json(result);
		})






	}
	finally {
		// await client.close();
	}
}
run().catch(console.dir);



app.get('/', (req, res) => {
	res.send("Tours Server Running");
})


app.listen(port, () => {
	console.log('Listening at port', port);
})