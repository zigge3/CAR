const mongoose = require('mongoose');

// define the User model schema
const NotificationSchema = new mongoose.Schema({
  userId: String,
  tag: String,
  callback: String
});


/**
 * The pre-save hook method.
 */
// NotificationSchema.pre('save', function saveHook(next) {
//   const notification = this;

//   // proceed further only if the password is modified or the user is new
//   if (!notification.isModified('tag')) return next();


// });


module.exports = mongoose.model('Notification', NotificationSchema);
