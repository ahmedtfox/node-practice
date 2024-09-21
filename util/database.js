const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callBack) => {
  MongoClient.connect(
    "mongodb+srv://ahmedmongo:rD=,98Hf^4umZQ}&>@cluster0.arm5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("connected");
      console.log("---".repeat(20));
      callBack(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
