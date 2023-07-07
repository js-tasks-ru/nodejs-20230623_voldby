const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.transp_bytes = 0;
  }

  _transform(chunk, encoding, callback) {
    this.transp_bytes += chunk.length;

    if (this.transp_bytes > this.limit)
    {
      this.transp_bytes -= chunk.length;
      callback(new LimitExceededError());
    }
    else
    {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
