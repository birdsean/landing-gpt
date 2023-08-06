export const isiOS = () => {
    // detect if browser is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }