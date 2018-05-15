const { spawn } = require('child_process')
const request = require('request')
const test = require('tape')

const env = Object.assign({}, process.env, {PORT: 5000})
const child = spawn('node', ['index.js'], {env})

test('responds to requests', (t) => {
    t.plan(4)

    child.stdout.on('data', _ => {
        request('http://127.0.0.1:5000', (error, response, body) => {
            child.kill()

            t.false(error)
            t.equal(response.statusCode, 200)
            t.notEqual(body.indexOf("<title>Node.js test</title>", -1))
            t.notEqual(body.indexOf("Getting started with Node"), -1)
        })
    })
})