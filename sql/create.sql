DROP TABLE IF EXISTS workday_waiter_relationship CASCADE;
DROP TABLE IF EXISTS workdays CASCADE;
DROP TABLE IF EXISTS waiters CASCADE;

CREATE TABLE workdays (
    id serial PRIMARY KEY,
    days TEXT NOT NULL
);

CREATE TABLE waiters (
    id serial PRIMARY KEY,
    users TEXT NOT NULL UNIQUE
);

CREATE TABLE workday_waiter_relationship (
    id serial PRIMARY KEY,
    workday_id integer REFERENCES workdays(id),
    waiter_id integer REFERENCES waiters(id),
    UNIQUE(workday_id, waiter_id) ON DELETE CASCADE
);
