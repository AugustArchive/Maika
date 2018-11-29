const http         = require('http');
const url          = require('url');
const { register } = require('prom-client');

module.exports = class MetricRegistry {
    start() {
        http
            .createServer((req, res) => {
                if (url.parse(req.url) === '/metrics') {
                    res.writeHead(200, { 'Content-Type': register.contentType });
                    res.write(register.metrics());
                }
                res.end();
            }).listen(5590);
    }
};