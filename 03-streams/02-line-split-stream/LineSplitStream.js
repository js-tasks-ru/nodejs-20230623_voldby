const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.last_line = '';
    this.iEOL = 0;
    this.liEOL = 0;
  }

  _transform(chunk, encoding, callback) {
     let strC = chunk.toString();

     this.iEOL = 0;
     this.liEOL = 0;
     while ((this.iEOL = strC.indexOf(os.EOL, this.liEOL)) >= 0)
     {
       this.last_line += strC.slice(this.liEOL, this.iEOL);
       this.push(this.last_line);
       this.last_line = '';
         this.liEOL = this.iEOL+os.EOL.length
     }

     if (this.liEOL < strC.length) {
         this.last_line += strC.slice(this.liEOL);
     }

     callback();
  }

  _flush(callback) {
    callback(null, this.last_line);
  }
}

module.exports = LineSplitStream;
