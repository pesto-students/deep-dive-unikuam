const COLON_REGEX = /:/g;
const SLASH_REGEX = /^\/+|\/+$/g;

class UrlUtility {
  parseUrl = (routePath, requestedUrl) => {
    let splittedRoutes = routePath.replace(SLASH_REGEX, '').split('/');
    let splittedUrls = requestedUrl.replace(SLASH_REGEX, '').split('/');
    return this.getParamsUrl(splittedRoutes, splittedUrls);
  }

  getParamsUrl = (splittedRoutes, splittedUrls) => {
    let temp = [];
    let params = {};
    for (const splittedRoute of splittedRoutes) {
      temp[splittedRoute] = true;
    }
    for (const splittedUrl of splittedUrls) {
      if (temp[splittedUrl]) {
        delete temp[splittedUrl];
      } else {
        let key = splittedRoutes[splittedUrls.indexOf(splittedUrl)].replace(COLON_REGEX, '');
        params[key] = splittedUrl;
      }
    }
    return params;
  }

  matchRequestUrls = (routePath, requestedUrl) => {
    let splittedRoutePath = routePath.replace(SLASH_REGEX, '').split('/');
    let splittedRequestedUrl = requestedUrl.replace(SLASH_REGEX, '').split('/');
    for (const routeComp of splittedRoutePath) {
      const index = splittedRoutePath.indexOf(routeComp);
      if ((splittedRequestedUrl[index] !== routeComp &&
          routeComp.indexOf(':') === -1) || splittedRequestedUrl === "") {
        return false;
      }
    }
    return true;
  }
}


module.exports = new UrlUtility();
