export default function WaiterRoutes(waiter_db) {

    async function waiter(req, res) {
        const username = req.params.username;
        const checkdays = await waiter_db.getDayNames();
        const daysForWaiter = await waiter_db.getDayNamesForWaiter(username);
        console.log(daysForWaiter);
        res.render('waiter', {
            username: username,
            scheduleDays: checkdays,
            daysForWaiter: daysForWaiter
        });
    }

    async function select(req, res) {
        const username = req.params.username;
        const scheduleDays = req.body.checkday;
        const waiter_id = await waiter_db.insertWaiter(username);

        for (const workday_id of scheduleDays) {
            //console.log("workday_id: " + workday_id);
            await waiter_db.selectDays(Number(workday_id), waiter_id);
        }

        //    console.log(req.body.checkday);
        res.redirect('/waiters/' + req.params.username);
    }


    async function updateDays(req, res) {
        await waiter_db.update()
        res.redirect('/waiters');
    }

    return {
        waiter,
        select,
        updateDays
    };

}
