require("dotenv").config();
const express = require("express");
const connection = require("./database");

const serverPort = process.env.APP_PORT || 5000;

const app = express();

app.use(express.json());

app.get("/users", (request, response) => {
  connection
    .query("SELECT * FROM user")
    .then(([users]) => {
      response.send(users);
    })
    .catch((err) => {
      console.log(err);
      response.sendStatus(500);
    });
});

app.get("/users/:id", (request, response) => {
  const id = parseInt(request.params.id);
  connection
    .query("SELECT * FROM user WHERE id = ?", [id])
    .then(([users]) => {
      if (users.length) response.send(users[0]);
      else response.sendStatus(404);
    })
    .catch((err) => {
      console.log(err);
      response.sendStatus(500);
    });
});

app.post("/users", (request, response) => {
  const user = request.body;
  connection
    .query("INSERT INTO user (name, email, country) VALUES (?,?,?)", [
      user.nom,
      user.mail,
      user.pays,
    ])
    .then(([datas]) => {
      user.id = datas.insertId;
      response.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
      response.sendStatus(500);
    });
});

app.put("/users/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const user = request.body;
  connection
    .query("UPDATE user SET name=?, email=?, country=? WHERE id = ?", [
      user.nom,
      user.mail,
      user.pays,
      id,
    ])
    .then(([datas]) => {
      if (datas.affectedRows > 0) response.sendStatus(204);
      else response.sendStatus(404);
    })
    .catch((err) => {
      console.log(err);
      response.sendStatus(500);
    });
  /*
  connection
    .query("UPDATE user SET ? WHERE id = ?", [user, id])
    .then(([datas]) => {
      if (datas.affectedRows > 0) response.sendStatus(204);
      else response.sendStatus(404);
    })
    .catch((err) => {
      console.log(err);
      response.sendStatus(500);
    });*/
});

app.delete("/users/:id", (request, response) => {
  const id = parseInt(request.params.id);
  connection
    .query("DELETE FROM user WHERE id = ?", [id])
    .then(([datas]) => {
      if (datas.affectedRows > 0) response.sendStatus(204);
      else response.sendStatus(404);
    })
    .catch((err) => {
      console.log(err);
      response.sendStatus(500);
    });
});

app.listen(serverPort);
