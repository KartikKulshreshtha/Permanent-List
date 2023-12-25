import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Configurations for our database
const database = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})
database.connect()
// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

app.get("/", async (req, res) => {
  try {
    const result = await database.query("SELECT * FROM items ORDER BY id ASC");
    const items = result.rows
    res.render("index.ejs", {
      listTitle: "Today's Tasks",
      listItems: items,
    });
  } catch (error) {
    console.log(error)
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    await database.query("insert into items (title) values ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error)
  }
});

app.post("/edit", async(req, res) => {
  try {
    const id = req.body.updatedItemId;
    const title = req.body.updatedItemTitle;
    await database.query("update items set title = ($2) where id = ($1)", [id, title])
    res.redirect("/");
  } catch (error) {
    console.log(error)
  }
});

app.post("/delete", async(req, res) => {
  try {
    const id = req.body.deleteItemId;
    await database.query("delete from items where id = ($1)", [id]);
    res.redirect("/");
  } catch (error) {
    console.log(error)
  }
 });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
