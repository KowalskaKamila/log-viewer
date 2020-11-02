var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');
const { once } = require('events');
const path = require('path'); 

app.use(express.json())
app.use(cors());

app.get('/logs', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    let all_logs = [];
    fs.readdirSync('.').forEach(file => {
        if (path.extname(file) == ".log") {
            all_logs.push({filename: file});
        }
    });
    res.send(JSON.stringify(all_logs));
})

let file_cache = {}

app.get('/logs/:file_name', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    let lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(req.params.file_name)
    });
  
    let lines = []
    // for (const line of lineReader) {
    //     // Each line in input.txt will be successively available here as `line`.
    //     console.log(`Line from file: ${line}`);
    //     lines.push(line)
    // }
    lineReader.on('line', function (line) {
        let parsedLine = line.split('\t');
        let newDate = parsedLine[0].replace(/,/g, ".")
        let unixTimestamp = Math.round(new Date(newDate).getTime()/1000);
        lines.push({
            date: unixTimestamp,
            thread: parsedLine[1],
            level: parsedLine[2],
            message: parsedLine[3],
        })
    });
    lineReader.on('close', function() {
        res.send(JSON.stringify(lines))
    });
    
})

var server = app.listen(8083, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})