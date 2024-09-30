const http = require('http');
const url = require('url');
const Utils = require('./modules/Utils');
const fs = require('fs');

const messages = JSON.parse(fs.readFileSync('./lang/en/en.json', 'utf-8'));

class Server {
    constructor() {
        this.utils = new Utils();
    }

    start() {
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const path = parsedUrl.pathname;
            const query = parsedUrl.query;

            if (path === '/COMP4537/labs/3/getDate/') {
                const name = query.name;
                if (name) {
                    const message = this.utils.getGreetingMessage(name, messages.greeting);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`<p style="color:blue">${message}</p>`);
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`<p style="color:red">${messages.missingName}</p>`);
                }

            } else if (path === '/COMP4537/labs/3/writeFile/') {
                const text = query.text;
                if (text) {
                    this.utils.writeToFile(text, (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/html' });
                            res.end(`<p style="color:red">${messages.writeError}</p>`);
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(`<p style="color:green">${messages.writeSuccess}</p>`);
                        }
                    });
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`<p style="color:red">${messages.missingText}</p>`);
                }

            } else if (path.startsWith('/COMP4537/labs/3/readFile/')) {
              const requestedFile = path.split('/').pop(); 
              const filePath = `./${requestedFile}`; 

              this.utils.readFromFile(filePath, (err, data) => {
                  if (err) {
                      const errorMessage = messages.fileNotFound.replace('%1', requestedFile);
                      res.writeHead(404, { 'Content-Type': 'text/html' });
                      res.end(`<p style="color:red">${errorMessage}</p>`);
                  } else {
                      res.writeHead(200, { 'Content-Type': 'text/html' });
                      res.end(`<pre>${data}</pre>`);
                  }
              });  
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<p style="color:red">${messages.invalidEndpoint}</p>`);
            }
        });

        server.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    }
}

const myServer = new Server();
myServer.start();
