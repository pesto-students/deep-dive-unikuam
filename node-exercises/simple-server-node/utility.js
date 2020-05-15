const { URL } = require('url');
// routePath: /users/:userId/books/:bookId
// requestedUrl: /users/1/books/2

function parseUrl(routePath, requestedUrl) {
  let params = {};
  let splittedRoutes = routePath.split('/');
  let splittedUrls = requestedUrl.split('/');
  let urlParams = getParamsUrl(splittedRoutes, splittedUrls);
  return urlParams;
}

function getParamsUrl(splittedRoutes, splittedUrls) {
    let temp = [];
    var params = {};
    for (const splittedRoute of splittedRoutes) {
        temp[splittedRoute] = true;
    }
    for (const splittedUrl of splittedUrls) {
        if (temp[splittedUrl]) {
          delete temp[splittedUrl];
        } else {
            let key = splittedRoutes[splittedUrls.indexOf(splittedUrl)].replace(/:/g, '');
            params[key] = splittedUrl;
        }
    }
    return params;
}

module.exports = { parseUrl };
