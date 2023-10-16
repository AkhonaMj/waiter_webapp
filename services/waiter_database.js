export default function WaiterDb(db) {

    async function insertWaiter(users) {
        const result = await db.one("INSERT INTO waiters (users) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id", [users]);
        return result.id;
    }

    async function selectDays(days) {
        const result = await db.oneOrNone("INSERT INTO workdays (days) VALUES ($1) RETURNING id", [days]);
        return result.id;
    }

    async function update(waiter) {
        const waiter_id = await db.manyOrNone("SELECT FROM waiters id WHERE users = $1", [waiter] )
        const result = await db.any("SELECT days FROM workdays WHERE users = $1");
        return result;
    }

    return {
        insertWaiter,
        selectDays,
        update
    };
}

