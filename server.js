'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/books',
  { useNewUrlParser: true, useUnifiedTopology: true });




//  create collections
//  create schema and model
const bookSchema = new mongoose.Schema({
  bookName: String,
  description: String,
  urlImg: String
});

const ownerSchema = new mongoose.Schema({
  ownerEmail: String,
  books: [bookSchema]
});

// build a model from our schema
const bookModel = mongoose.model('book', bookSchema);
const myOwnerModel = mongoose.model('owner', ownerSchema);


function seedBookCollection() {
  const  HarryPotter = new bookModel({
    bookName: 'Harry Potter and the Goblet of Fire',
    description: 'A generation grew up on Rowling’s all-conquering magical fantasies, but countless adults have also been enthralled by her immersive world. Book four, the first of the doorstoppers, marks the point where the series really takes off. The Triwizard Tournament provides pace and tension, and Rowling makes her boy wizard look death in the eye for the first time.',
    urlImg: 'https://i5.walmartimages.com/asr/810803e8-a900-48da-9f51-0163df609898_1.8b89af58642b89f54d225ef6ff2cb43a.jpeg?odnWidth=612&odnHeight=612&odnBg=ffffff'
  });
  const Half = new bookModel({
    bookName: 'Half of a Yellow Sun',
    description: 'When Nigerian author Adichie was growing up, the Biafran war “hovered over everything”. Her sweeping, evocative novel, which won the Orange prize, charts the political and personal struggles of those caught up in the conflict and explores the brutal legacy of colonialism in Africa.',
    urlImg: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327934717l/18749.jpg'
  });

  HarryPotter.save();
  Half.save();
}
// seedBookCollection();


function seedOwnerCollection() {
  const motasim = new myOwnerModel({
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

  const zienab = new myOwnerModel({
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
  zienab.save();
}
//  seedOwnerCollection();



app.get('/books',getBooksHandler);
app.post('/addBook', addBooksHandler);
app.delete('/deleteBook/:index',deleteBooksHandler);
app.put('/updatebook/:index', updateBookHandler);


// GET FUNCTION
 function getBooksHandler(req,res) {
  let {email} = req.query;
  myOwnerModel.find({ownerEmail:email},function(err,ownerData){
      if(err) {
          console.log('did not work')
      } else {
          console.log(ownerData)
          // console.log(ownerData[0])
          // console.log(ownerData[0].books)
          res.send(ownerData[0].books)
      }
  })
}


// POST FUNCTION
function addBooksHandler(req, res) {
  console.log(req.body);
  const {bookName,description, urlImg, ownerEmail } = req.body;
  // console.log(bookName);
  // console.log(bookDescription);
  // console.log(bookUrlImg);

  myOwnerModel.find({ ownerEmail:ownerEmail }, (error, ownerData) => {
    if (error) { res.send('not working') }
    else {
      console.log('before pushing', ownerData[0]);
      ownerData[0].books.push({
        bookName: bookName,
        description: description,
        urlImg: urlImg,

      })
      console.log('after pushing', ownerData[0])
      ownerData[0].save();

      res.send(ownerData[0].books);

    }

  })
}


// DELETE FUNCTION
function deleteBooksHandler(req, res) {
  console.log(req.params);
  let { email } = req.query;
  const index = Number(req.params.index);

  myOwnerModel.find({ ownerName: email }, (error, ownerData) => {
    const newBooksArr = ownerData[0].books.filter((book, idx) => {
      if (idx !== index) return book;
    })
    ownerData[0].books = newBooksArr;
    ownerData[0].save();
    res.send(ownerData[0].books)
  })

}


// PUT FUNCTION
function updateBookHandler(req, res) {

  console.log(req.body);
  console.log(req.params.index);

  const { bookName, description, urlImg, ownerEmail } = req.body;
  const index = Number(req.params.index);

  myOwnerModel.findOne({ ownerEmail: ownerEmail }, (error, ownerData) => {
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


app.listen(PORT, () => console.log(`listening on ${PORT}`));