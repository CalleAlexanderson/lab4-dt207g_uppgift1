const mongoose = require("mongoose");

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

const userAccount = mongoose.model("userAccount", userAccountSchema);

removeAllDocuments();

let arr = [{
    accountUserName: "Caal2301",
    userName: "Calle Alexanderson",
    password: "Lösenord",
    mail: "calle.alexanderson@telia.com",
    creationDate: new Date()
}]


async function removeAllDocuments() {
    const result = await userAccount.deleteMany({});
    console.log(result);
    userAccount.insertMany(arr)
}