export default function WaiterDb(db) {

    async function insertWaiter(users) {
        const result = await db.one("INSERT INTO waiters (users) VALUES ($1) ON CONFLICT (users) DO UPDATE SET users = excluded.users RETURNING id", [users]);
        return result.id;
    }

    async function selectDays(days, users) {
        await db.none("INSERT INTO workday_waiter_relationship (workday_id, waiter_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [days, users]);
    }

    async function update(waiter) {
        const waiter_id = await db.manyOrNone("SELECT FROM waiters id WHERE users = $1", [waiter])
        const result = await db.any("SELECT days FROM workdays WHERE users = $1");
        return result;
    }

    async function getDayNames() {
        const result = await db.any("SELECT * FROM workdays");
        return result;
    }

    async function getDayNamesForWaiter(user) {
        const result = await db.any(`
        SELECT users, days
        FROM waiters, workdays, workday_waiter_relationship wwr
        WHERE wwr.waiter_id = waiters.id AND wwr.workday_id = workdays.id AND users = '$1'
        ORDER BY workday_id
        `, [user]);
        return result;
    }




    return {
        insertWaiter,
        selectDays,
        update,
        getDayNames,
        getDayNamesForWaiter
    };
}

