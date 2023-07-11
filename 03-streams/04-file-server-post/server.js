const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitStream = require('./LimitSizeStream');

const server = new http.Server();

const fileSizeLimit = 1048576;

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  function responseErr(res, statusCode, err_msg){
    res.statusCode = statusCode;
    res.end(err_msg);
  }

  function releaseStreams(req, fS, lS)
  {
     req.unpipe(lS);
     lS.end();
     lS.unpipe(fS);
     fS.end();
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
    case 'POST':
      if (fs.existsSync(filepath)){
        responseErr(res, 409, `File '${pathname}' already exists`);
      }
      else {
         let limitStream = new LimitStream({limit: fileSizeLimit});
         let fileStream = fs.createWriteStream(filepath);

         req.pipe(limitStream).pipe(fileStream);

         limitStream.on('error', (err) => {
           if (err && err.code === 'LIMIT_EXCEEDED')
           {
             responseErr(res, 413, err.message);
             releaseStreams(req, fileStream, limitStream);
             fs.unlink(filepath, (err) => {
               if (err)
                 console.log('Error to delete file '+filepath);
             });
           }
         });

        fileStream.on('finish', ()=> {
          //console.log('finish');
          res.statusCode = 201;
          res.end(`File '${pathname}' uploaded`);
          releaseStreams(req, fileStream, limitStream);
        });

        //Connection lost or request fully finished:
        req.on('close', () => {
          if (req.destroyed /*finished*/ && !req.complete /*lost*/){
            releaseStreams(req, fileStream, limitStream);
            fs.unlink(filepath, (err) => {
              if (err)
                console.log('Error to delete file ' + filepath);
            });
          }
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
