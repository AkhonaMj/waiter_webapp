import assert from "assert";
import WaiterDb from "../services/waiter_database.js"; // Import the WaiterDb module
import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();
const pgp = pgPromise();
const connectionString = process.env.CONNECTION_STRING;
const db = pgp(connectionString);

// Creating an instance for the database factory function

describe("Waiter Webapp", function () {
  const waiterInst = WaiterDb(db);

  this.timeout(5000);

  beforeEach(async function () {
    await db.none("TRUNCATE TABLE waiters RESTART IDENTITY CASCADE");
    await db.none("TRUNCATE TABLE workdays RESTART IDENTITY CASCADE");
  });

  describe("insertWaiter", function () {
    it("should insert a waiter name into the database", async () => {
      const waiterInst = WaiterDb(db);
      const waiter = "Jimmy";
  
      const insertedId = await waiterInst.insertWaiter(waiter);
  
      const result = await db.one("SELECT * FROM waiters WHERE id = $1", [insertedId]);
  
      assert.equal(result.users, waiter);
    });
  });
  

  describe("selectDays", function () {
    it("should select days for a waiter", async function () {
      const waiterInst = WaiterDb(db);
      const days = [{ day_id: 1 }, { day_id: 2 }, { day_id: 7 }];
      const waiter = "Lee";
      await waiterInst.selectDays(days, waiter);
  
      const retrievedDays = await waiterInst.getDayNames(waiter);
  
      const formattedRetrievedDays = retrievedDays.map((item) => ({ day_id: item.workday_id }));
  
      assert.equal(formattedRetrievedDays, days);
    });
  });


  describe("getDayNames", function () {
  it("should get all day names", async function () {
    const waiterInst = WaiterDb(db);
    const expectedDays = [
      { day_id: 1 },
      { day_id: 2 },
      { day_id: 3 },
      { day_id: 4 },
      { day_id: 5 },
      { day_id: 6 },
      { day_id: 7 },
    ];

    const retrievedDays = await waiterInst.getDayNames();

    assert.equal(retrievedDays, expectedDays);
  });
});

  //   describe("getDayNamesForWaiter", function () {
  //     it("should get day names for a specific waiter", async function () {});
  //   });
  describe("getDayNamesForAllWaiters", function () {
    it("should get day names for all waiters", async function () {
  
      const expectedResults = [
        { users: 'waiter1', workday_iddays: 'Monday' },
        { users: 'waiter2', days: 'Tuesday' },
      ];
  
      // Call the function to retrieve the actual results from the database
      const actualResults = await waiterInst.getDayNamesForAllWaiters();
  
      // Perform deep comparison between the actual and expected results
      assert.deepStrictEqual(actualResults, expectedResults);
    });
  });
  

  //   describe("getWaiterNamesForDay", function () {
  //     it("should get waiter names for a specific day", async function () {});
  //   });

    describe("resetSchedule", function () {
      it("should reset the schedule", async function () {
        const waiterInst = WaiterDb(db);

      });
    });
  after(async () => {
    await db.$pool.end();
  });
});
