const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

let app = express();


// this was helpful for configs:
// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
app.use(serveStatic(__dirname + "/dist"));


app.get('*', function (req, res) {
    if (req.path.indexOf("10.") === 1) {
        // they are calling us with a DOI and want the oaDOI service
        const redirectUrl = req.protocol + "://oadoi.org" + req.path
        res.redirect(redirectUrl)

    }
    else if (req.path === "/journals"){
        const redirectUrl = "https://unsub.org/";
        res.redirect(redirectUrl);

    }
    else {
        // they want the unpaywall webpage
        res.sendfile('./dist/index.html');
    }


});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port ' + port)
});