import bodyParser from "body-parser";
import express from "express";
import fs from "node:fs"

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.post("/write", (req, res) => {
    // req.body -> write
    const { body } =  req;
    const data = new Uint8Array(Buffer.from(JSON.stringify(body)));

    fs.writeFile('./DATA.txt', data, 'utf8', (err, data) => {
      console.log(err, data);
    });
    
    res.send("success!");
  
});

app.get("/read",  (req, res) => {
    fs.readFile("./DATA.txt", 'utf8', (err, data) => {
      res.send(data);
    });
});

app.listen(port, () => {
  console.log(`my backend listening on port ${port}`);
});

