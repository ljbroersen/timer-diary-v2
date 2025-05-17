import express from "express";
import cors from "cors";
import knex from "./knex.js";
import { port } from "./config.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/dates", async (req, res) => {
  try {
    const dates = await knex.select().table("date_table");
    res.json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/logs", async (req, res) => {
  const { dateId } = req.query;

  if (!dateId || typeof dateId !== "string") {
    res.status(400).json({ message: "Invalid or missing dateId parameter" });
    return;
  }

  try {
    const logs = await knex("logs_table").where("date_id", dateId);
    const parsedLogs = logs.map((log) => ({
      ...log,
      tasks: log.tasks ? JSON.parse(log.tasks) : [],
    }));
    res.json(parsedLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logs/create", async (req, res) => {
  const { date, timer_leftover, description, title, tasks } = req.body;

  if (
    !date ||
    !timer_leftover ||
    !description ||
    !title ||
    !Array.isArray(tasks)
  ) {
    res.status(400).json({
      message:
        "Missing required fields: date, timer_leftover, description, title, tasks",
    });
    return;
  }

  try {
    let dateRecord = await knex("date_table").where({ date }).first();
    if (!dateRecord) {
      const [newDateId] = await knex("date_table")
        .insert({ date })
        .returning("id");
      dateRecord = { id: newDateId };
    }

    const [newLog] = await knex("logs_table")
      .insert({
        date_id: dateRecord.id,
        timer_leftover,
        description,
        title,
        tasks: JSON.stringify(tasks),
      })
      .returning("*");

    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error inserting log:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
