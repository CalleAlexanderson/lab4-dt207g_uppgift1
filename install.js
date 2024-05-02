const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DATABASE).then(() => {
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
    },
    creationDate: {
        type: Date,
        require: true
    }
});

const crypto = require("crypto")
console.log(crypto.randomBytes(64).toString('hex'));

const userAccount = mongoose.model("userAccount", userAccountSchema);

removeAllDocuments();


async function removeAllDocuments() {
    const result = await userAccount.deleteMany({});
    console.log(result);
}