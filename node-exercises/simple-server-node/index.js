const http = require('http');
const { parseUrl } = require('./utility');

//api code
class SimpleServer {
  constructor() {
    this.server = null;
    this.routes = [];
    this.serverProcess = this.serverProcess.bind(this);
    this.initServer();
  }

  setRoutes = ({ route, method, callback }) => {
    this.routes.push({ route , method, callback });
  }

  get = (route, callback) => {
    if (typeof route != 'string') {
      throw new Error(`Expected route of String type, got ${typeof route}`);
    } else if (route.indexOf('/') !== 0) {
      throw new Error(`Invalid route path provided, expected beginning with "/"`);
    }
    // TODO: check for valid : & /
    if (typeof callback != 'function') {
      throw new Error(`Expected route of Function type, got ${typeof route}`)
    }
    const method = 'GET';
    this.setRoutes({ route, method, callback });
  }

  initServer = () => {
    this.server = http.createServer(this.serverProcess);
  }

  serverProcess = (request, response) => {
      for (const { route, method, callback } of this.routes) {
        const requestedUrl = request.url;
        const params = parseUrl(route, requestedUrl);
        request.params = params;
        callback(request, response);
      }
  }

  listen = (port) => {
    this.server.listen(port);
  }
}
//client code
const app = new SimpleServer();
app.get('/users/:userId/books/:bookId', (request, response) => {
  console.log(request.params.bookId);
});

app.listen(3000);
