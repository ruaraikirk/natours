const mongoose = require('mongoose');
const app = require('./app');

// Handle errors outside of express: uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
});

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

const server = app.listen(process.env.PORT, () => {
  console.info(`App running on port ${process.env.PORT}...`);
});

// Handle errors outside of express: unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.error('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
