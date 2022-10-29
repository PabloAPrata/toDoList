const express = require("express");
const routes = express.Router();

let db = [
  { name: "Tomar o café da manhã", checked: true },
  { name: "Terminar o trabalho", checked: false },
  { name: "Aula de inglês", checked: false },
];

routes.get("/tasks", (req, res) => {
  return res.json(db);
});

routes.post("/add-task", (req, res) => {
  const body = req.body;

  if (!body) return res.status(400).end();
  
  db.push(body);
  return res.json(body);
});

routes.delete("/:id", (req, res) => {
  const id = req.params.id;
  const newDB = db.filter(function (elemento, index) {
    if (index != id) return true;
  });

  db = newDB;
  return res.json(db);
});

routes.put("/rename", (req, res) => {
  const body = req.body;
  db[body.index].name = body.text;

  if (!body) return res.status(400).end();

  return res.json(db);
});

routes.put("/check", (req, res) => {
  const body = req.body;
  db[body.index].checked = body.checked;

  if (!body) return res.status(400).end();

  return res.json(db);
});

module.exports = routes;
