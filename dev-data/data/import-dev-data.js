// const fs = require('fs');
const mongoose = require('mongoose');
// const Tour = require('../../models/tourModel');

// NOT WORKING - ISSUES RUNNING SCRIPT
const database = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
// );

// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     console.log('Tour data successfully loaded');
//   } catch (err) {
//     console.log(err);
//   }
// };

// const deleteData = async () => {
//   try {
//     await Tour.deleteMany();
//     console.log('Tour data successfully deleted');
//   } catch (err) {
//     console.log(err);
//   }
// };

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected successfully!');
  });

console.log(process.argv);
