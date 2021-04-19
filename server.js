let express = require('express');
let expressWs = require('express-ws');
let app = express();
let router = express.Router();
let jwt = require('jsonwebtoken');
let path = require('path');
let fs = require('fs');
let Token = require('./token');
let DataService = require('./data/dataService');
let passport = require('passport');
let logger = require('./util/logger');
// let passportConfig = require('./util/passport');
let requestCount = 1;

expressWs(app);
app.use(express.urlencoded());
app.use(express.json());
app.use(passport.initialize());
app.use('/', router);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));

//allow custom header and CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

let dataService = new DataService();
(async () => dataService.connect().catch((error) => {
    logger.log('error', `Failed to connect the database. Error: ${JSON.stringify(error)}`);
}))();

router.get('/', (req, res) => {
    console.log(req.ip + " requested!!!");
    res.redirect('/login.html');
});

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/userInfo');
    });

router.get('/auth/github', passport.authenticate('github'));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, message) => {
        if (err) {
            res.status(401).send({
                message: 'userName or password is wrong!'
            });
        } else if (message) {
            res.send(message);
        } else {
            console.log('Request ---- ' + requestCount++);
            const token = Token.encrypt({
                userName: req.body.userName,
                password: req.body.password
            }, 60 * 60);
            res.status(200).send({
                token: token
            });
            //  res.redirect('/home.html');
        }
    })(req, res, next);
})

router.get('/userInfo', (req, res) => {
    let data = Token.decrypt(req.headers.authorization.split(' ')[1]);
    res.status(200).json(data);
})

router.ws('/message', (ws, request) => {
    ws.send('Connected!!!!!!!');
    ws.on('message', (msg) => {
        console.log(msg);
    })
})

let server = app.listen(3000, () => {
    console.log(server.address().address);
})

// dev or prod, replace the url
let env = process.argv[2];
const devUrl = '192.168.218.133:3000';
const prodUrl = 'justdoit.iask.in:15572';

let replacedUrl;
if (env) {
    if (env.includes('dev')) {
        replacedUrl = devUrl;
    } else if (env.includes('prod')) {
        replacedUrl = prodUrl;
    }
    fs.readdir(path.join(__dirname, '/public'), (error, files) => {
        if (error) {
            return console.error(error);
        }
        files.forEach((file) => {
            if (file.endsWith('.js')) {
                replaceFileContent(path.join(__dirname + '/public', file), devUrl, replacedUrl)
            }
        });
    })
}

let replaceFileContent = (file, originContent, replacedContent) => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let result = content.replace(originContent, replacedContent);

        try {
            fs.writeFileSync(file, result, 'utf8');
            console.log(`Replced content for ${file} successed!`);
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log('Errors occured when replacing file content!!!')
    }
};
