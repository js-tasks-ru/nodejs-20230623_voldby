const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') > 0)
  {
    res.statusCode = 400;
    res.end('Subfolders are not supported.');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
        let file_stream = fs.createReadStream(filepath);
        file_stream.pipe(res);
        file_stream.on('error', (error) => {
          if (error.code === 'ENOENT')
          {
            res.statusCode = 404;
            res.end('File not found.');
          }
          else
          {
            res.statusCode = 500;
            res.end('Server error: '+error.code);
          }
        });

        res.on('close', ()=>{
            file_stream.destroy();
        });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
