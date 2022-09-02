const mongoose = require('mongoose');
const app = require('./app');

const database = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

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

app.listen(process.env.PORT, () => {
  console.info(`App running on port ${process.env.PORT}...`);
});
