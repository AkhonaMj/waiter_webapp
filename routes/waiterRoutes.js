export default function WaiterRoutes(waiter_db) {
  async function waiter(req, res) {
    const username = req.params.username.replace(/^\w/, (c) => c.toUpperCase());
    const checkdays = await waiter_db.getDayNames();
    const daysForWaiter = await waiter_db.getDayNamesForWaiter(username);
    // console.log(daysForWaiter);
    const successMsg = req.flash("success")[0];

    const formattedDaysForWaiter = checkdays.map((day) => {
      return {
        id: day.id,
        days: day.days,
        checked: daysForWaiter.some((waiterDay) => waiterDay.days === day.days), // Setting 'checked' to true if the day is included in daysForWaiter
      };
    });

    // console.log(formattedDaysForWaiter);

    res.render("waiter", {
      username: username,
      scheduleDays: formattedDaysForWaiter,
      daysForWaiter: daysForWaiter,
      successMsg: successMsg,
    });
  }

  async function select(req, res) {
    const username = req.params.username;
    const scheduleDays = req.body.checkday;
    const waiter_id = await waiter_db.insertWaiter(username);

    for (const workday_id of scheduleDays) {
      //console.log("workday_id: " + workday_id);
      await waiter_db.selectDays(Number(workday_id), waiter_id);
      req.flash("success", "You have successfully updated your schedule.");
    }
    //    console.log(req.body.checkday);
    res.redirect("/waiters/" + req.params.username);
  }

  async function updateDays(req, res) {
    await waiter_db.update();
    res.redirect("/waiters");
  }

  async function viewWorkingWaiters(req, res) {
    //const daysForAllWaiter =  await waiter_db.getWaiterNamesForDay();
    const days = {
      Monday: await waiter_db.getWaiterNamesForDay("Monday"),
      Tuesday: await waiter_db.getWaiterNamesForDay("Tuesday"),
      Wednesday: await waiter_db.getWaiterNamesForDay("Wednesday"),
      Thursday: await waiter_db.getWaiterNamesForDay("Thursday"),
      Friday: await waiter_db.getWaiterNamesForDay("Friday"),
      Saturday: await waiter_db.getWaiterNamesForDay("Saturday"),
      Sunday: await waiter_db.getWaiterNamesForDay("Sunday"),
    };

    console.log(days);
    res.render("admin", {
      days,
    });
  }

  async function reset(req, res) {
    await waiter_db.resetSchedule();
    req.flash("success", "Schedule cleared successfully!");
    res.redirect("/");
  }

  return {
    waiter,
    select,
    updateDays,
    viewWorkingWaiters,
    reset,
  };
}
