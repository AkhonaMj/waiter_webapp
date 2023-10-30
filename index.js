import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config()
import pgPromise from "pg-promise";
import WaiterRoutes from "./routes/waiterRoutes.js";
import WaiterDb from "./services/waiter_database.js";

const pgp = pgPromise();
const app = express();

const exphbs = engine({
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    helpers: {
        applyClassName: function(users) {
            if (users.length < 3) {
                return 'too-few';
            } else if (users.length === 3) {
                return 'just-right';
            } else {
                return 'too-many';
            }
        }
    }

});


const db = pgp({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

// Create instances for the factory function
const waiter_db = WaiterDb(db)

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

const waiters = WaiterRoutes(waiter_db)

app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/waiters/:username', waiters.waiter);


app.post('/waiters/:username', waiters.select);

app.get('/days',waiters.viewWorkingWaiters);

app.post('/reset', waiters.reset);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});