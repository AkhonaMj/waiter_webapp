import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config()
import pgPromise from "pg-promise";
import WaiterRoutes from "./routes/waiterRoutes.js";

const pgp = pgPromise();
const app = express();

const exphbs = engine({
    defaultLayout: 'main',
    layoutsDir: 'views/layouts'
});


const db = pgp({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});



// Create instances for the factory function


app.engine('handlebars', exphbs);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

const waiter_routes = WaiterRoutes()
// app.get('/', );

app.get('/', (req, res) => {
    res.render('waiter'); 
});

app.get('/waiters/:username', waiter_routes.waiter);
//app.post('/waiters/:username', waiter_routes.waiter);
// app.get('/days',);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});