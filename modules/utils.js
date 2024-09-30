const fs = require('fs');
const path = require('path');

class Utils {
    getDate() {
        return new Date().toString();
    }

    getGreetingMessage(name, greetingTemplate) {
        const currentTime = this.getDate();
        return greetingTemplate.replace('%1', name).replace('%2', currentTime);
    }

    writeToFile(text, callback) {
      const filePath = path.join(__dirname, '../file.txt');

      fs.writeFile(filePath, text + '\n', { flag: 'a' }, (err) => {
          callback(err);
      });
  }

  readFromFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}
}

module.exports = Utils;
