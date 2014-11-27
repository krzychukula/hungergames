module.exports = {
  db: process.env.MONGOLAB_URI || process.env.MONGODB || 'mongodb://localhost:27017/game',
  sessionSecret: process.env.SESSION_SECRET || 'Default session secret',
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  }
};
