export default function WaiterDb(db) {

    async function selectDays(days) {
        await db.none("INSERT INTO workdays (days) VALUES ($1)", [days]);
    }

    return {
        selectDays
    };
}
