import assert from "assert";
import WaiterDb from "../services/waiter_database.js"; // Import the WaiterDb module
import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();
const pgp = pgPromise();
//const connectionString = process.env.CONNECTION_STRING;
// const db = pgp(connectionString);
const db = pgp({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
      rejectUnauthorized: false
  }
});


// Creating an instance for the database factory function

describe("Waiter Webapp", function () {
  const waiterInst = WaiterDb(db);


 // this.timeout(5000);

  beforeEach(async function () {
    await db.none("TRUNCATE TABLE waiters RESTART IDENTITY CASCADE");
  });


  
  describe("insertWaiter", function () {
    it("should insert a waiter name into the database", async () => {
      const waiterInst = WaiterDb(db);
      const waiter = "Jimmy";

      const insertedId = await waiterInst.insertWaiter(waiter);

      const result = await db.one("SELECT * FROM waiters WHERE id = $1", [
        insertedId,
      ]);

      assert.equal(result.users, waiter);
    });
  });

  describe("selectDays", function () {
    it("should select days for a waiter", async function () {
      const waiterInst = WaiterDb(db);
      const days = ["1", "3", "4"];
      const waiter = await waiterInst.insertWaiter("Nonny");
      for (let i = 0; i < days.length; i++) {
        await waiterInst.selectDays(days[i], waiter);
      }
      const retrievedDays = await waiterInst.getDayNamesForWaiter("Nonny");

      const formattedRetrievedDays = [
        { users: "Nonny", days: "Monday" },
        { users: "Nonny", days: "Wednesday" },
        { users: "Nonny", days: "Thursday" },
      ];

      assert.deepStrictEqual(retrievedDays, formattedRetrievedDays);
    });
  });

  describe("getDayNames", function () {
    it("should get all day names", async function () {
      const waiterInst = WaiterDb(db);
      const expectedDays = [
        { days: "Monday", id: 1 },
        { days: "Tuesday", id: 2 },
        { days: "Wednesday", id: 3 },
        { days: "Thursday", id: 4 },
        { days: "Friday", id: 5 },
        { days: "Saturday", id: 6 },
        { days: "Sunday", id: 7 },
      ];
      const retrievedDays = await waiterInst.getDayNames();

      assert.deepStrictEqual(retrievedDays, expectedDays);
    });
  });

  describe("getWaiterNamesForDay", function () {
    it("should get waiter names for a specific day", async function () {
      const waiterInst = WaiterDb(db);
      const results = [
        { users: "Nonny", days: "Monday" },
        { users: "Manny", days: "Monday" },
        { users: "Lisa", days: "Monday" },
      ];
      await waiterInst.selectDays("1", await waiterInst.insertWaiter("Nonny"));
      await waiterInst.selectDays("1", await waiterInst.insertWaiter("Manny"));
      await waiterInst.selectDays("1", await waiterInst.insertWaiter("Lisa"));
      const workDays = await waiterInst.getWaiterNamesForDay("Monday");
      assert.deepStrictEqual(workDays, results);
    });
  });

  describe("resetSchedule", function () {
    it("should reset the schedule", async function () {
      const waiterInst = WaiterDb(db);

      const workdaysForWaiters = [];

      await waiterInst.selectDays("1", await waiterInst.insertWaiter("Nonny"));
      await waiterInst.selectDays("1", await waiterInst.insertWaiter("Manny"));
      await waiterInst.selectDays("1", await waiterInst.insertWaiter("Lisa"));

      await waiterInst.resetSchedule();

      assert.deepStrictEqual([], workdaysForWaiters);
    });
  });
});
