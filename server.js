const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

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
    },
    creationDate: {
        type: Date,
        require: true
    }
});

const userAccount = mongoose.model("userAccount", userAccountSchema);

app.get("/users", async (req, res) => {
    try {
        let result = await userAccount.find({});

        return res.json(result);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//logga in
app.post("/users:accname", async (req, res) => {
    try {
        let result = await userAccount.find({ accountUserName: req.params.accname });

        return res.json(result);
    } catch (err) {
        return res.status(400).json(err);
    }
})

// skapa konto
app.post("/users", async (req, res) => {
    try {
        let activeAccs = await userAccount.find({});

        if (activeAccs) {
            let uniqueName = true;
            //kollar om användarnamn redan används
            for (let index = 0; index < activeAccs.length; index++) {
                if (req.body.accountUserName == activeAccs[index].accountUserName) {
                    uniqueName = false
                }
            }
            if (uniqueName == true) {
                let result = await userAccount.create(req.body);
                return res.json(result);
            } else {
                return res.status(400).json({ message: "kontonamn används redan" })
            }
        }
    } catch (err) {
        return res.status(400).json(err);
    }
})

//change password, inte säkert alls eftersom alla kan ändra lösenord
app.put("/users/:accname", async (req, res) => {
    try {
        let result = await userAccount.updateOne({ accountUserName: req.params.accname },
            {
                $set: {
                    "password": req.body.password,
                }
            });

        return res.json(result);
    } catch (err) {
        return res.status(400).json(err);
    }
})

//delete account
app.delete("/users/:accname", async (req, res) => {
    try {
        // ska ta med en password från body, ska kolla att det stämmer så bara de med lösnord kan ta bort kontot
        if (true) {
            let result = await userAccount.deleteOne({ accountUserName: req.params.accname });
            return res.json(result);
        } else {
            return res.json({ message: "felaktigt användarnamn eller lösenord" })
        }
    } catch (err) {
        return res.status(400).json(err);
    }
})

app.listen(port, () => {
    console.log("Server is listening");
})