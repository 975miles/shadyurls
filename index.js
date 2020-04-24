const fs = require('fs'),
    path = require('path'),
    express = require('express');

process.env.NODE_ENV = 'production';

if (!fs.existsSync('./config.js')) fs.writeFileSync('./config.js', fs.readFileSync('./defaultconfig.js', 'utf8'));
const cfg = require('./config');

if (!fs.existsSync('./pages.json')) fs.writeFileSync('./pages.json', JSON.stringify(Object())); //If the pages file doesn't exist, create it with an empty object.
var pages = JSON.parse(fs.readFileSync('./pages.json')); //Read the pages file.

var app = express();
app.use(require('body-parser').urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    let text = req.body.text;

    //text validation
    if (text == null || text.length == 0) return res.send('No text provided.');
    else if (text.length > cfg.maxPageLength) return res.send(`The following text was too long (over ${cfg.maxPageLength} characters):<br><br>${text}`);
    
    //url creation
    let newPageUrl;
    do {
        newPageUrl = cfg.blocks.prefix;
        let blocks = Array();
        for (let i=0;i<cfg.blocks.amount;i++) {
            let block = String();
            for (let i=0;i<cfg.blocks.charAmount;i++) block += cfg.blocks.availableChars[Math.floor(Math.random() * cfg.blocks.availableChars.length)];
            blocks.push(block);
        }
        newPageUrl += blocks.join(cfg.blocks.separator);
        newPageUrl += cfg.blocks.suffix;
    } while (pages.hasOwnProperty(newPageUrl)); //If there is already a page with the generated url, generate a new one.
    

    //page creation
    pages[newPageUrl] = text; //create the page
    res.redirect(`${cfg.redirectURL}/${newPageUrl}`); //redirect the user to the newly created page
    fs.writeFileSync('./pages.json', JSON.stringify(pages)); //save the pages file
});

app.get('/*', (req, res) => {
    let url = req.url.slice(1);
    if (pages.hasOwnProperty(url)) res.send(pages[url]); //if a page with the url exists, send it to the user.
    else res.send('That isn\'t a page.'); //if it doesn't exist, tell the user
});

console.log(`Attempting to start the web server on port ${cfg.port}.`);
const server = app.listen(cfg.port, () => {
    console.log(`Web server started.`);
});