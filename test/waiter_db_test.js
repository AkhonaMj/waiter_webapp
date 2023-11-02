import assert from "assert";
import WaiterDb from "../services/waiter_database.js";
import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config()

const pgp = pgPromise();
const connectionString = process.env.CONNECTION_STRING
const db = pgp(connectionString);



describe("Waiter webapp", async function () {

    // creating an instance for the database factory function
    const waiterInst = WaiterDb(db);

    this.timeout(5000);

    // clearing the tables before each test case
    beforeEach(async function () {
        await db.none("TRUNCATE TABLE waiters RESTART IDENTITY CASCADE");
        await db.none("TRUNCATE TABLE workdays RESTART IDENTITY CASCADE");
    });

    describe("insertWater", async function () {

        it("should be able to insert waiters", async function () {
            const waiterInst = WaiterDb(db);
            await waiterInst.insertWaiter('Neev');
            assert.deepEqual(await waiterInst.getWaiterNamesForDay(), [{ users: 'Neev' }]);
        });
    });
     
    describe("Reset", async function () {
        it("should be able to clear waiter schedule", async function () {
            assert.deepEqual(await waiterInst.resetSchedule(), [])


        });
    });


});