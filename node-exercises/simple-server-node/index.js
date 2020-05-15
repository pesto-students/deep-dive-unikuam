const http = require('http');
const UrlUtility = require('./utility');
const formidable = require('formidable');
const utils = require('util');
const {
  URL
} = require('url');
//api code
class SimpleServer {
  constructor() {
    this.server = null;
    this.routes = [];
    this.serverProcess = this.serverProcess.bind(this);
    this.initServer();
  }

  setRoutes = ({
    route,
    method,
    callback
  }) => {
    this.routes.push({
      route,
      method,
      callback
    });
  }

  get = (route, callback) => {
    if (typeof route != 'string') {
      throw new Error(`Expected route of String type, got ${typeof route}`);
    }
    // TODO: check for valid : & /
    if (typeof callback != 'function') {
      throw new Error(`Expected route of Function type, got ${typeof route}`)
    }
    const method = 'GET';
    this.setRoutes({
      route,
      method,
      callback
    });
  }

  post = (route, callback) => {
    if (typeof route != 'string') {
      throw new Error(`Expected route of String type, got ${typeof route}`);
    }
    // TODO: check for valid : & /
    if (typeof callback != 'function') {
      throw new Error(`Expected route of Function type, got ${typeof route}`)
    }
    const method = 'POST';
    this.setRoutes({
      route,
      method,
      callback
    });
  }

  initServer = () => {
    this.server = http.createServer(this.serverProcess);
  }

  checkForMultipartContentType = (header) => {
    if (header === 'multipart/form-data') {
      return true;
    }
    if (typeof header !== 'undefined' && header.indexOf(';') !== -1) {
      let splittedHeader = header.split(';');
      if (splittedHeader.includes('multipart/form-data')) {
        return true;
      }
    }
    return false;
  }

  validateHeadersAndCollectBody = (request, response, cb) => {
    const headers = request.headers;
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    }).on('end', () => {
      let data = {};
      let postOrPut = request.method === 'POST' || request.method === 'PUT';
      if (typeof headers['content-length'] === 'undefined' && postOrPut) {
        data = {
          body,
          error: true,
          statusCode: '400',
          info: 'Content-length header not defined.'
        };
      } else if (Number(headers['content-length']) !== body.length && postOrPut) {
        data = {
          body,
          error: true,
          statusCode: '400',
          info: 'Content length does not match with actual body length.'
        };
      } else {
        data = {
          body,
          error: false,
          statusCode: '',
          info: ''
        };
      }
      cb({
        data
      });
    })

  }

  serverProcess = (request, response) => {
    let isError = false;
    let bodyObj = {};
    for (const {
        route,
        method,
        callback
      } of this.routes) {
      if (UrlUtility.matchRequestUrls(route, request.url) && request.method === method) {
        if (this.checkForMultipartContentType(request.headers['content-type'])) {
          let form = new formidable.IncomingForm();
          form.parse(request, (err, fields, files) => {
            // TODO: Need to add code for handling body for 'multipart/form-data'
            console.log(files, fields);
          });
        } else {
          this.validateHeadersAndCollectBody(request, response, ({
            data: {
              body,
              error,
              statusCode,
              info
            }
          }) => {
            if (error) {
              response.statusCode = statusCode;
              response.end(info);
            }
            const requestedUrl = request.url;
            const params = UrlUtility.parseUrl(route, requestedUrl);
            const urlParams = new URL('http://abc.com/?' + body);
            for (const [key, value] of urlParams.searchParams) {
              bodyObj[key] = value;
            }
            request.params = params;
            request.body = bodyObj;
            callback(request, response);
          });
        }
      }
    }
  }

  listen = (port) => {
    this.server.listen(port);
  }
}
//client code
const app = new SimpleServer();
app.get('/users/:userId/books/:bookId/', (request, response) => {
  // console.log(response.setHeader('contentType', 'appliation/text'));
  response.end(JSON.stringify(request.params));
});
app.post('/users/:id', (request, response) => {
  // response.end(JSON.stringify(request.params));
  response.end(JSON.stringify(request.body));
  // response.end(request.bodies);
  //call using get()
});

app.listen(3000);
