var express = require('express'),
    bodyParser = require('body-parser'),
    json = require('./movies.json'),
    app = express(),
    request = require('request');

app.set('port', process.env.PORT || 3500);
app.use(bodyParser.urlencoded({ 'extended': true }));
app.use(bodyParser.json());
var router = new express.Router();
app.use(router);

router.get('/test', (req, res) => {
    var data = {
        name: 'Roman Shutsman',
        website: 'https://github.com/romanshutsman'
    };
    res.json(data);
});
router.get('/', (req, res) => {
    res.json(json);
});
router.post('/', (req, res) => {
    if (req.body.Id && req.body.Title && req.body.Director &&
        req.body.Year && req.body.Rating) {
        json.push(req.body);
        res.json(json);
    } else {
        res.status(500).json({ error: 'message' });
    }
});
router.put('/:id', (req, res) => {
    if (req.params.id && req.body.Title && req.body.Director &&
        req.body.Year && req.body.Rating) {
        json.forEach((elem, index) => {
            if (elem.Id === req.params.id) {
                elem.Title = req.body.Title;
                elem.Director = req.body.Director;
                elem.Year = req.body.Year;
                elem.Rating = req.body.Rating;
            }
        });
        res.json(json);
    } else {
        res.status(500).json({ error: 'There was an error!' });
    }
});
router.delete('/:id', (req, res) => {
    var indexToDel = -1;
    json.forEach((elem, index) => {
        if (elem.Id === req.params.id) {
            indexToDel = index;
        }
    });
    if (~indexToDel) {
        json.splice(indexToDel, 1);
    }
    res.json(json);
});

router.get('/external-api', (req, res) => {
    request({
        method: 'GET',
        uri: 'http://localhost:' + (process.env.PORT || 3500),
    }, (error, response, body) => {
        if (error) { throw error; }
        const movies = [];
        const data = JSON.parse(body);
        data.forEach((elem, index) => {
            movies.push({
                Title: elem.Title,
                Rating: elem.Rating
            });
        })
        const sorted = movies.sort((a, b) => b.Rating - a.Rating);
        res.json(sorted);
    });
});

router.get('/imdb', function (req, res) {
    request({
        method: 'GET',
        uri: 'http://sg.media-imdb.com/suggests/a/aliens.json',
    },  (err, response, body) => {
        if (error) { throw error; }
            let data = body.substring(body.indexOf('(') + 1);
            data = JSON.parse(data.substring(0, data.length - 1));
            const related = [];
            data.d.forEach((movie, index) => {
                related.push({
                    Title: movie.l,
                    Year: movie.y,
                    Poster: movie.i ? movie.i[0] : ''
                });
            });
            res.json(related);
        });
});
router.get('/football', function (req, res) {
    request({
        method: 'GET',
        uri: 'http://api.football-api.com/2.0/competitions?Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76',
    },  (err, response, body) => {
        if (err) { throw err; }
            const data = JSON.parse(body);
            res.json(data);
        });
});
var server = app.listen(app.get('port'), function () {
    console.log('Server up: http://localhost:' + app.get('port'));
});