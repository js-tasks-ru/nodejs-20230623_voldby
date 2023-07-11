const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  function responseErr(res, statusCode, err_msg){
    res.statusCode = statusCode;
    res.end(err_msg);
  }

  if (pathname.indexOf('/') > 0){
    responseErr(res, 400, "Subfolders are not supported.");
    return;
  }

  if (pathname.length === 0){
    responseErr(res, 400, "File name not defined");
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
          if (err)
            responseErr(res, 500`Error to delete file ${pathname}`)
          else {
            res.statusCode = 200;
            res.end(`File ${pathname} deleted`);
          }
        });
      }
      else {
        responseErr(res, 404, `File '${pathname}' not found`);
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
