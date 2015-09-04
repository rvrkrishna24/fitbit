module.exports = {
    db: 'mongodb://localhost/fitbit',
    port: 3000,
    fb: {
      app_id : '1481154355515850',
      app_secret : '75f2ca2b2904d40f4c797d78537453d7',
      callbackURL :  'http://localhost:3000/auth/facebook/callback',
      feedUrl: 'https://graph.facebook.com/me/feed',
      locationRedirect: 'http://localhost:3000'
    },
    google: {
      client_id : '536416163748-e4rjm6cbdkscbu4ereeone051gj5pd5b.apps.googleusercontent.com',
      client_secret : 'AIxVfBkVK93HoXHmo6j4WToO',
      callbackURL :  'http://localhost:3000/auth/google/callback',
      locationRedirect: 'http://localhost:3000'
    },
};