// This file used ChatGPT to help code
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const Utils = require('./modules/utils');
const Messages = require('./lang/en/en');

class Server {
    static start() {
        const server = http.createServer(this.handleRequest.bind(this));

        // Start the server and listen on port 3000
        server.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }

    static handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;

        if (pathname.includes('/writeFile')) {
            this.writeFile(query.text, res);
        } else if (pathname.includes('/readFile')) {
            const filePath = path.join(__dirname, 'file.txt');
            this.readFile(filePath, res);
        } else {
            this.greetUser(query, res);  // Serve the greet user page by default
        }
    }

    // C.1: Append text to a file
    static writeFile(text, res) {
        const filePath = path.join(__dirname, 'file.txt');
        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Error: No text provided in query.');
            return;
        }

        // Append text to the file (create if it doesn't exist)
        fs.appendFile(filePath, text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error writing to file');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Text "${text}" appended to file.txt`);
        });
    }

    // C.2: Read the file and return its content
    static readFile(filePath, res) {
        // Check if the file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`Error 404: ${path.basename(filePath)} not found`);
                return;
            }

            // Read the file content
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading the file');
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            });
        });
    }

    // Original greetUser function from Part B
    static greetUser(query, res) {
        const name = query.name || 'Guest';  // Default to 'Guest' if no name is provided
        const serverTime = Utils.getDate();
        let message = Messages.greeting.replace('%1', name).replace('%2', serverTime);
        const styledMessage = `<div style="color: blue;">${message}</div>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(styledMessage);
    }
}

// Start the server
Server.start();
