const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const https = require('https')
const { resolve } = require('path')

function checkCookies(cookies) {
    return Object.keys(cookies).length > 0
}

module.exports = function (app) {
    app.use(cookieParser('TEST_KEY'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.get('/*', function (req, res, next) {
        if (!checkCookies(req.cookies) && !req.path.includes('login')) {
            res.redirect('/login?redirectUrl=/' + req.params[0])
        } else {
            next()
        }
    })

    app.get('/login', function (req, res) {
        console.log('req', req.path, req.method, req.cookies)
        if (Object.keys(req.cookies).length > 0) {
            const { redirectUrl = '/' } = req.query
            res.redirect(redirectUrl)
        } else {
            res.sendFile(resolve(__dirname, '../../src/login.html'))
        }
    })

    app.post('/login', function (req, res) {
        const body = JSON.stringify(req.body)
        const requestOpts = {
            hostname: 'cms-api-dev.giaonhanhanghoa.xyz',
            path: '/api/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }
        const request = https
            .request(requestOpts, (incommingRes) => {
                let data = ''
                incommingRes.on('data', (chunk) => {
                    data += chunk
                })
                incommingRes.on('end', () => {
                    const bodyRes = JSON.parse(data)
                    if (bodyRes.status === 0) {
                        let options = {
                            maxAge: bodyRes.data.expiresIn
                            // httpOnly: true // The cookie only accessible by the web server
                        }
                        res.cookie('accessToken', bodyRes.data.accessToken, options)
                        res.cookie('userId', bodyRes.data.userId, options)
                        res.cookie('expiresIn', bodyRes.data.expiresIn, options)
                        res.cookie('currentItem', req.body.username, options)
                        res.redirect(req.query.redirectUrl || '/')
                    } else {
                        returnLoginWithError(bodyRes.message, res)
                    }
                })
            })
            .on('error', (err) => {
                console.log('Error: ', err.message)
                res.redirect(req.path)
            })

        request.write(body)
        request.end()
    })
}

const fs = require('fs')
function returnLoginWithError(message, res) {
    fs.readFile(resolve(__dirname, '../../src/login.html'), function (err, buffer) {
        if (err) res.status(500).send('Error when loading file')
        else {
            const content = buffer.toString()
            res.send(content.replace('<head>', `<head> \n <meta name="error" content="${message}" /> \n`))
        }
    })
}
