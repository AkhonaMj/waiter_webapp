export default function WaiterRoutes(waiter_db) {

    function waiter(req, res) {
        req.params.username
        
        res.render('waiter', {
        });
    }

    async function select(req, res) {
        await waiter_db.selectDays(req.body.check);
        res.redirect('/');
    }




    return {
        waiter,
        select
    };
    u
}
