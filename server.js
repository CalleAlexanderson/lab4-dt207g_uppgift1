const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

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

// visa alla användare
app.get("/users", async (req, res) => {
    try {
        let result = await userAccount.find({});

        return res.json(result);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//logga in
app.post("/users/login", async (req, res) => {
    try {

        const { accountUserName, password } = req.body;

        if (!accountUserName || !password) {
            return res.status(400).json({ error: "Invalid input, send accountUserName and password" })
        } else {
            //hämtar user
            const user = await userAccount.find({ accountUserName: req.body.accountUserName });

            if (user) { //om user finns kollas lösenord
                if (await bcrypt.compare(password, user[0].password)) { //om lösenord är korrekt skickas user tillbaka
                    //skapar en JWT, taget från videon i läsanvisningar
                    const payload = {accountUserName: accountUserName} 
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
                    const respone = {
                        user: user,
                        token: token
                    }
                    return res.json(respone);
                } else {
                    return res.status(400).json({ message: "incorrect accountUserName/password" });
                }
            } else {
                return res.status(400).json({ message: "incorrect accountUserName/password" });
            }
        }
    } catch (err) {
        return res.status(400).json(err);
    }
})

//om JWT är korrekt skickas det tillbaka länk till cats.html så användaren kan gå till sidan
app.get("/users/protected", authenticateToken, (req, res) =>{
    res.json({protectedSite: "http://localhost:1234/cats.html"})
})

//om JWT är korrekt skickas det tillbaka info om katten på bilden
app.get("/users/cat", authenticateToken, (req, res) =>{
    res.json({catName: "Blixtis", catAge: "17"})
})

//kollar om JWT är korrekt, taget från videon i läsanvisningar
function authenticateToken(req,res, next) {
    const authheader = req.headers['authorization'];
    const token = authheader && authheader.split(' ')[1]; // tar bort bearer

    if (token == null) {
        res.status(401).json({message: "not authorized to see this content, pls log in first"})
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err)=>{
        if (err) {
            return res.status(403).json({message: "not correct JWT"})
        }
    })
    next();
}

// skapa konto
app.post("/users/register", async (req, res) => {
    try {
        let { accountUserName, userName, password, mail, creationDate } = req.body;
        if (!accountUserName || !userName || !password || !mail || !creationDate) {
            return res.status(400).json({ error: "Invalid input, send accountUserName, userName, password, mail and creationDate" })
        }
        let activeAccs = await userAccount.find({});
        password = await bcrypt.hash(password, 10); //hashar password
        if (activeAccs) {
            let uniqueName = true;
            //kollar om användarnamn redan används
            for (let index = 0; index < activeAccs.length; index++) {
                if (req.body.accountUserName == activeAccs[index].accountUserName) {
                    uniqueName = false
                }
            }
            if (uniqueName == true) {
                let result = await userAccount.create({ accountUserName, userName, password, mail, creationDate });
                return res.json(result);
            } else {
                return res.status(400).json({ message: "kontonamn används redan" })
            }
        } else {
            return res.status(500).json({ message: "Konton kan inte hämtas för att kolla om kontonamn är unikt" });
        }
    } catch (err) {
        return res.status(400).json(err);
    }
})

//change password, inte säkert alls eftersom alla kan ändra lösenord
app.put("/users/updatepassword", async (req, res) => {
    try {
        const { accountUserName, password } = req.body;
        let hashedPass = await bcrypt.hash(password, 10); //hashar password
        if (hashedPass) {
            let result = await userAccount.updateOne({ accountUserName: accountUserName },
                {
                    $set: {
                        "password": hashedPass,
                    }
                });
    
            return res.json(result);
        }
    } catch (err) {
        return res.status(400).json(err);
    }
})

//delete account
app.delete("/users/delete", async (req, res) => {
    try {
        const { accountUserName, password } = req.body;
        const user = await userAccount.find({ accountUserName: accountUserName });

        //kollar så lösenord stämmer
        if (await bcrypt.compare(password, user[0].password)) {
            let result = await userAccount.deleteOne({ accountUserName: accountUserName });
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