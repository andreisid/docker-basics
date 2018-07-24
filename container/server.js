'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const sqlite3 = require('sqlite3');

var html = "v2.0 </br> <h5>DB query result: </h5> ";

let db = new sqlite3.Database('./chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
    html += err.message +"</br>";
  }
  console.log('Connected to the chinook database.');
});

db.serialize(() => {
  db.each(`SELECT PlaylistId as id,
                  Name as name
           FROM playlists`, (err, row) => {
    if (err) {
      console.error(err.message);
      html += err.message +"</br>";
    }
    html += row.id + "\t" + row.name + "</br>";
    //console.log(row.id + "\t" + row.name);
  });
});

// App
const app = express();
app.get('/', (req, res) => {
  res.send('<h3>node.js on docker</h3>\n' + html);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
