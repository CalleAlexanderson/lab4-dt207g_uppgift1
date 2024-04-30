const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/dt207lab4").then(() => {
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log("error when connecting to database: " + err);
})

const userAccountSchema = new mongoose.Schema({
    accountUserName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    }
});

const userAccount = mongoose.model("userAccount", userAccountSchema);

removeAllDocuments();

let arr = [{
    accountUserName: "Caal2301",
    userName: "Calle Alexanderson",
    password: "Lösenord",
    mail: "calle.alexanderson@telia.com"
}]


async function removeAllDocuments() {
    const result = await userAccount.deleteMany({});
    console.log(result);
    userAccount.insertMany(arr)
}