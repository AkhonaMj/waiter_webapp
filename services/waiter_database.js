export default function WaiterDb(db) {

  async function insertWaiter(users) {
      const result = await db.one("INSERT INTO waiters (users) VALUES ($1) ON CONFLICT (users) DO UPDATE SET users = excluded.users RETURNING id", [users]);
      return result.id;
  }

  async function selectDays(days, users) {
      await db.none("INSERT INTO workday_waiter_relationship (workday_id, waiter_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [days, users]);
  }

    async function unselectDays(days, users) {
      await db.none("DELETE FROM workday_waiter_relationship WHERE workday_id = $1 AND waiter_id = $2", [days, users]);
  }



  async function getDayNames() {
      const result = await db.any("SELECT * FROM workdays");
      return result;
  }

  async function getDayNamesForWaiter(users) {
      const result = await db.any(`
      SELECT users, days
      FROM waiters, workdays, workday_waiter_relationship wwr
      WHERE wwr.waiter_id = waiters.id
      AND wwr.workday_id = workdays.id
      AND users = $1
      ORDER BY workday_id`, [users]);
      return result;
  }

  async function getDayNamesForAllWaiters() {
      const result = await db.any(`
      SELECT users, days
      FROM waiters, workdays, workday_waiter_relationship wwr
      WHERE wwr.waiter_id = waiters.id
      AND wwr.workday_id = workdays.id
      ORDER BY workday_id`
      );
      return result;
  }
  
  async function getWaiterNamesForDay(day) {
      const result = await db.any(`
      SELECT users, days
      FROM waiters, workdays, workday_waiter_relationship wwr
      WHERE wwr.waiter_id = waiters.id
      AND wwr.workday_id = workdays.id
      AND days = $1
      ORDER BY workday_id`, [day]
      );
      return result;
  }
async function resetSchedule(){
  await db.any("DELETE FROM workday_waiter_relationship");
}


  return {
      insertWaiter,
      selectDays,
      getDayNames,
      getDayNamesForWaiter,
      getDayNamesForAllWaiters,
      getWaiterNamesForDay,
      resetSchedule,
      unselectDays
  };
}