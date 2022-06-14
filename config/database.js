const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {

    mongoose
    .connect(MONGO_URI, {
    })
    .then((req) => {
        console.log("Succesfully connected to database")
    })
    .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
};