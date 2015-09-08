module.exports = {
    db: 'mongodb://localhost/fitbit',
    port: 3000,
    fb: {
      app_id : '', //give your app id
      app_secret : '', //give your fb app secret
      callbackURL :  'http://localhost:3000/auth/facebook/callback',
      feedUrl: 'https://graph.facebook.com/me/feed',
      locationRedirect: 'http://localhost:3000'
    },
    google: {
      client_id : '',//Create a client id for your gmail
      client_secret : '', //Create one for your gmail
      callbackURL :  'http://localhost:3000/auth/google/callback',
      locationRedirect: 'http://localhost:3000'
    },
};
