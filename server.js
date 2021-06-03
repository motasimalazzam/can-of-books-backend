'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true });


const bookSchema = new mongoose.Schema({
    bookName: String,
    description: String,
    urlImg: String
});

const ownerSchema = new mongoose.Schema({
    ownerEmail: String,
    books: [bookSchema]
})


const bookModel = mongoose.model('book', bookSchema);
const ownerModel = mongoose.model('owner', ownerSchema);

function seedBookCollection() {
    const HarryPotter = new bookModel({
        bookName: 'Harry Potter and the Goblet of Fire',
        description: 'A generation grew up on Rowling’s all-conquering magical fantasies, but countless adults have also been enthralled by her immersive world. Book four, the first of the doorstoppers, marks the point where the series really takes off. The Triwizard Tournament provides pace and tension, and Rowling makes her boy wizard look death in the eye for the first time.',
        urlImg: 'https://i5.walmartimages.com/asr/810803e8-a900-48da-9f51-0163df609898_1.8b89af58642b89f54d225ef6ff2cb43a.jpeg?odnWidth=612&odnHeight=612&odnBg=ffffff'
    });
    const HalfOfYellowSun = new bookModel({
        bookName: 'Half of a Yellow Sun',
        description: 'When Nigerian author Adichie was growing up, the Biafran war “hovered over everything”. Her sweeping, evocative novel, which won the Orange prize, charts the political and personal struggles of those caught up in the conflict and explores the brutal legacy of colonialism in Africa.',
        urlImg: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327934717l/18749.jpg'
    });

    HarryPotter.save();
    HalfOfYellowSun.save();
}
// seedBookCollection();

function seedOwnerCollection() {
    const motasim = new ownerModel({
        ownerEmail: 'motasim.alazzam5@gmail.com',
        books: [
            {
                bookName: 'Harry Potter and the Goblet of Fire',
                description: 'A generation grew up on Rowling’s all-conquering magical fantasies, but countless adults have also been enthralled by her immersive world. Book four, the first of the doorstoppers, marks the point where the series really takes off. The Triwizard Tournament provides pace and tension, and Rowling makes her boy wizard look death in the eye for the first time.',
                urlImg: 'https://i5.walmartimages.com/asr/810803e8-a900-48da-9f51-0163df609898_1.8b89af58642b89f54d225ef6ff2cb43a.jpeg?odnWidth=612&odnHeight=612&odnBg=ffffff'
            },
            {
                bookName: 'Half of a Yellow Sun',
                description: 'When Nigerian author Adichie was growing up, the Biafran war “hovered over everything”. Her sweeping, evocative novel, which won the Orange prize, charts the political and personal struggles of those caught up in the conflict and explores the brutal legacy of colonialism in Africa.',
                urlImg: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327934717l/18749.jpg'
            }
        ]
    })

    const zienab = new ownerModel({
        ownerEmail: 'yahyazainab204@gmail.com',
        books: [
            {
                bookName: 'Harry Potter and the Goblet of Fire',
                description: 'A generation grew up on Rowling’s all-conquering magical fantasies, but countless adults have also been enthralled by her immersive world. Book four, the first of the doorstoppers, marks the point where the series really takes off. The Triwizard Tournament provides pace and tension, and Rowling makes her boy wizard look death in the eye for the first time.',
                urlImg: 'https://i5.walmartimages.com/asr/810803e8-a900-48da-9f51-0163df609898_1.8b89af58642b89f54d225ef6ff2cb43a.jpeg?odnWidth=612&odnHeight=612&odnBg=ffffff'
            },
            {
                bookName: 'Half of a Yellow Sun',
                description: 'When Nigerian author Adichie was growing up, the Biafran war “hovered over everything”. Her sweeping, evocative novel, which won the Orange prize, charts the political and personal struggles of those caught up in the conflict and explores the brutal legacy of colonialism in Africa.',
                urlImg: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327934717l/18749.jpg'
            }
        ]
    })

    motasim.save();
    zienab.save()
}


// seedOwnerCollection();

app.get('/', homePageHandler);
app.get('/books', getBooksHandler);
app.post('/addBook', addBooksHandler);
app.delete('/deleteBook/:index', deleteBooksHandler);
app.put('/updatebook/:index', updateBookHandler);


//http://localhost:3001/books?email=motasim.alazzam5@gmail.com
function getBooksHandler(req, res) {
    let { email } = req.query;
    // let {name} = req.query
    ownerModel.find({ ownerEmail: email }, function (err, ownerData) {
        if (err) {
            console.log('did not work')
        } else {
            console.log(ownerData)
            // console.log(ownerData[0])
            // console.log(ownerData[0].books)
            res.send(ownerData[0].books)
        }
    })
}


function addBooksHandler(req, res){

    const {bookName, description, urlImg, ownerEmail} = req.body;
    console.log(bookName);

    ownerModel.find({ownerEmail:ownerEmail}, (error, ownerData)=>{
        if(error){
            res.send('did not work')
        } else{
            ownerData[0].books.push({
                bookName: bookName,
                description: description,
                urlImg: urlImg
            })
            ownerData[0].save();
            res.send(ownerData[0].books)
        }
    })
}

function deleteBooksHandler(req, res) {
    const {ownerEmail} = req.query;

    const index = Number(req.params.index)

    ownerModel.find({ownerEmail:ownerEmail}, (error, ownerData)=>{
        const newBookArr = ownerData[0].books.filter((book,idx)=>{
            if (idx !== index) {
                return book;
            }
        })
        ownerData[0].books = newBookArr;
        ownerData[0].save();
        res.send(ownerData[0].books);
    })
}



function updateBookHandler(req, res) {

  console.log(req.body);
  console.log(req.params.index);

  const { bookName, description, urlImg, ownerEmail } = req.body;
  const index = Number(req.params.index);

  ownerModel.findOne({ ownerEmail: ownerEmail }, (error, ownerData) => {
    console.log(ownerData);
    ownerData.books.splice(index, 1, {
      bookName: bookName,
      description: description,
      urlImg: urlImg,
    })

    ownerData.save();
    console.log(ownerData)
    res.send(ownerData.books)
  })

}

function homePageHandler(req, res) {
    res.send('Hello from the homePage')
}

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})




