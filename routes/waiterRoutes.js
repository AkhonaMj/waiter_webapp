export default function WaiterRoutes(waiter_db) {
  // async function login(req, res) {
    
  //   return {

  //   };
  // }

  async function waiter(req, res) {
    const username = req.params.username.replace(/^\w/, (c) => c.toUpperCase());
    const checkdays = await waiter_db.getDayNames();
    const daysForWaiter = await waiter_db.getDayNamesForWaiter(username);
    const successMsg = req.flash("success")[0];
    // console.log(daysForWaiter);
    const formattedDaysForWaiter = checkdays.map((day) => {
      return {
        id: day.id,
        days: day.days,
        checked: daysForWaiter.some((waiterDay) => waiterDay.days === day.days), // Setting 'checked' to true if the day is included in daysForWaiter
      };
    });

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
    const dayIds = ["1", "2", "3", "4", "5", "6", "7"];
    const waiter_id = await waiter_db.insertWaiter(username);

    // Check if less than two days are selected
    if (!scheduleDays || scheduleDays.length < 2) {
      req.flash(
        "success",
        "Please select at least two days for your schedule."
      );
      return res.redirect("/waiters/" + req.params.username);
    }

    // Unselect all days first
    for (const workday_id of dayIds) {
      await waiter_db.unselectDays(Number(workday_id), waiter_id);
    }

    // Select the chosen days
    for (const workday_id of dayIds) {
      if (scheduleDays.includes(workday_id)) {
        await waiter_db.selectDays(Number(workday_id), waiter_id);
      }
    }

    req.flash("success", "You have successfully updated your schedule.");
    res.redirect("/waiters/" + req.params.username);
  }

  async function viewWorkingWaiters(req, res) {
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
    res.redirect("/days");
  }

  return {
    waiter,
    select,
    viewWorkingWaiters,
    reset,
   //. login,
  };
}
