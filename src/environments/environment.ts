export const environment = {
  api: {
    gateway: 'http://localhost:9080'
  },
  keycloak: {
    config: {
      url: 'http://localhost:7080',
      realm: 'multipos-dev',
      clientId: 'multipos-posconsole-app'
    },
    initOptions: {
      onLoad: 'login-required',
      checkLoginIframe: false
    }
  }
};
