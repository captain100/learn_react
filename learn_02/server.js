var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express();


var COMMENTS_file = path.join(__dirname, 'comment.json');
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'pulice')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/comments', function (req, res) {
    fs.readFile(COMMENTS_file, function (err, data) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        res.json(JSON.parse(data));
    })
})

app.post('/api/comments', function (req, res) {
    // console.log('req.body',fs);
    fs.readFile(COMMENTS_file, function (err, data) {

        if (err) {
            console.log(err);
            process.exit(1);
        }

        var comments = JSON.parse(data);
        var newComments = {
            id: Date.now(),
            author: req.body.author,
            text: req.body.text
        }
        comments.push(newComments);
        fs.writeFile(COMMENTS_file, JSON.stringify(comments, null, 4), function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            res.json(comments);
        })
    })
});


app.listen(app.get('port'), function () {
    console.log('server started: http://localhost:' + app.get('port') + '/')
})