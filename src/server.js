/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cors = require('cors')
const favicon = require('serve-favicon')
const got = require('got')

dotenv.config()

passport.use(
    new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
        handleApiRequest('/api/auth', req.method, JSON.stringify({ username, password }))
            .then(({ statusCode, body }) => {
                if (statusCode === 401) done(null, false, req.flash('message', body.message))
                else done(null, { username, ...body.data })
            })
            .catch((err) => done(err))
    })
)

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

app.use(cors())
app.use(express.static(path.join(__dirname), { index: false, maxAge: '1y' }))
app.use(favicon(path.join(__dirname, '/favicon.ico')))
app.use(cookieParser('PROD_KEY'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'PROD_KEY', resave: true, saveUninitialized: true, cookie: { expires: 3 * 60 * 60 * 1000 } }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

function checkLoggedIn(req, res, next) {
    if (!req.user && !req.path.includes('login')) {
        const queryParams = Object.keys(req.query).length > 0 ? '?' + new URLSearchParams(req.query).toString() : ''
        res.redirect('/login?redirectUrl=' + req.path + queryParams)
    } else if (req.user && req.path.includes('login')) res.redirect(req.query.redirectUrl)
    else next()
}

app.all(/^(?!\/login|\/logout|\/api).*/, checkLoggedIn, function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, buffer) {
        if (err) res.status(500).send('Error when loading index file')
        const content = buffer.toString()
        res.send(
            content.replace(
                '<head>',
                `<head> \n <meta name="user" content="${req.user.username}" /> \n <meta name="id" content="${req.user.userId}" /> \n <meta name="role-view" content="${req.user.role}" /> \n`
            )
        )
    })
})

app.all('/api/*', checkLoggedIn, async function (req, res) {
    if (req.url.includes('/bill/export')) {
        const url = 'https://' + process.env.BASE_API_URL + req.url
        got.stream(url, {
            headers: { Authorization: 'Bearer ' + req.user.accessToken }
        }).pipe(res)
    } else {
        const queryParams = Object.keys(req.query).length > 0 ? '?' + new URLSearchParams(req.query).toString() : ''
        const json = await handleApiRequest(
            req.path + queryParams,
            req.method,
            JSON.stringify(req.body),
            req.user.accessToken
        )
        res.status(json.statusCode)
        res.json(json.body)
    }
})

app.get('/login', checkLoggedIn, function (req, res) {
    const flashMessage = req.flash('message')
    res.set('Cache-Control', 'no-cache')
    if (flashMessage.length > 0) {
        returnLoginWithError(flashMessage[0], res)
    } else {
        res.sendFile(path.join(__dirname, '/login.html'))
    }
})

app.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: req.query.redirectUrl || '/',
        failureRedirect: '/login?redirectUrl=' + req.query.redirectUrl || '/',
        failureFlash: true
    })(req, res, next)
})

app.post('/logout', function (req, res) {
    req.logout()
    res.json({ done: true })
})

function handleApiRequest(path, method, body, token) {
    const requestOpts = {
        hostname: process.env.BASE_API_URL,
        path,
        method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            Authorization: 'Bearer ' + token
        }
    }
    return new Promise((resolve, reject) => {
        const request = https
            .request(requestOpts, (incommingRes) => {
                let data = ''
                incommingRes.on('data', (chunk) => (data += chunk))
                incommingRes.on('end', () => {
                    if (data.startsWith('{' || '[')) {
                        resolve({ statusCode: incommingRes.statusCode, body: JSON.parse(data) })
                    } else {
                        resolve({ statusCode: incommingRes.statusCode, body: data, headers: incommingRes.headers })
                    }
                })
            })
            .on('error', (err) => reject(err))

        request.write(body)
        request.end()
    })
}

function returnLoginWithError(message, res) {
    fs.readFile(__dirname + '/login.html', function (err, buffer) {
        if (err) res.status(500).send('Error when loading file')
        const content = buffer.toString()
        res.send(content.replace('<head>', `<head> \n <meta name="error" content="${message}" /> \n`))
    })
}

const port = process.env.PORT || 3007
const httpServer = http.createServer(app)
httpServer.listen(port)
console.log('> Ready on http://localhost:' + port)
