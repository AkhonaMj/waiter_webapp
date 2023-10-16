export default function WaiterRoutes(waiter_db) {

    async function waiter(req, res) {
        const username = req.params.username
        // const scheduleDays = await waiter_db.update(username)
      //  console.log(scheduleDays);

        res.render('waiter', {
            username: username,
            //scheduleDays: scheduleDays

        });
    }

    async function select(req, res) {
        // await waiter_db.insertWaiter(req.params.username);
        // await waiter_db.selectDays(req.body.checkday);
        console.log(req.body.checkday);
        res.redirect('/waiters/' + req.params.username);
    }

    async function updateDays(req, res) {
        await waiter_db.update()
        res.redirect('/waiter');
    }


    return {
        waiter,
        select,
        updateDays
    };

}
