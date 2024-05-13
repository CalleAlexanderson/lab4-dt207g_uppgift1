# API som hanterar Användarkonton samt Autentisering och Auktorisering 
Detta repo innehåller kod ett REST API byggt med Express och stöd för CORS. API:et funkar som en mellanhand till en databas med användarkonton.
CRUD (Create, Read, Update, Delete) är implementerad.

## Installation, databas
API:et använder en MongoDB-databas för att lagra data.
Klona ner repot, kör kommandot npm install för att installera de npm-paket som används. 
Skapa en databas i mongoDB(compass) och connect:a till den och lägg sedan in den länken i "mongoose.connect("url")". <br/>
Kör filen install.js om du vill tömma collection useraccounts samt skapa en JWT för att lägga i env filen.

useraccounts använder ett schema som ser ut såhär: <br/>
(accountUserName är namnet på kontot medan userName är användarens full namn) 
```
    accountUserName:{
        type: String, 
        required: true
    },
    userName:{
        type: String, 
        required: true
    },
    password:{
        type: String, 
        required: true
    },
    mail:{
        type: String, 
        required: false
    },
    creationDate:{
        type: String, 
        required: false
    }
```
## Användning
Nedan finns de olika sätt API:et kan anropas

|Metod  |Ändpunkt     |Beskrivning                                                                           |
|-------|-------------|--------------------------------------------------------------------------------------|
|GET    |/users        |Hämtar alla användarkonton från databasen                                               |
|GET    |/users/protected      |Om JWT stämmer med den aktiva skickas en länk tillbaka som leder till en skyddad undersida. Anropet kräver en JWT i auth.                                             |
|POST    |/users/login | Loggar in på ett konto som ligger i databasen, skickar tillbaka en JWT. Anropet kräver ett accountUserName och korrekt lösenord för kontot skickas med i body.                                           |
|POST    |/users/register | Skapar ett konto i databasen med ett lösenord som hashats med bcrypt. Anropet kräver alla parametrar från useraccounts schema och accountUserName måste vara unikt.                                     |
|PUT   |/users/updatepassword | Uppdaterar lösenord för angivet konto. Anropet kräver accountUserName och ett (nytt) password                          |
|DELETE |/users/delete | Tar bort ett konto som matchar det accountUserName som skickas med, lösenord måste stämma överens med kontot. Anropet kräver ett accountUserName samt lösenordet för kontot.                                                       |

Datan på databasen lagras i BSON och kan se ut såhär:
```
{
   _id: "66337e6643bcbae7a89f3edf",
   accountUserName: "Calle",
   userName: "Calle Alexanderson",
   password: "$2b$10$TVA3ZbsGK7f4YeX8AIv3cO9A2/EuF3E8ZyZXZTjHSS0N.DypqR4Qe",
   mail: "calle.alexanderson@telia.com",
   creationDate: 2024-05-02T11:52:06.083+00:00
}
