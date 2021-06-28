let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
let passport = require('passport');

let User = require('../models/user');
let authenticate = require('../authenticate');

router.use(bodyParser.json());

//admin level

// GET users in organization

router.get('/' , authenticate.verifyUser, authenticate.verifyAdmin ,  (req , res , next) => {
  User.find({organization : req.user.organization})
  .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
})

//add users to organization

router.post('/adduser', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.register(new User({ username: req.body.username }),
      req.body.password, (err, user) => {
          if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({ err: err });
          }
          else {
              if (req.body.organization) {
                  user.organization = req.user.organization; // so that user can add users only to his/her organization
              }
              if (req.body.firstname) {
                  user.firstname = req.body.firstname;
              }
              if (req.body.lastname) {
                  user.lastname = req.body.lastname;
              }
              if (req.body.username) {
                  user.username = req.body.username;
              }
              if (req.body.email) {
                  user.email = req.body.email;
              }
              if (req.body.contactNo) {
                  user.contactNo = req.body.contactNo;
              }
              if (req.body.address) {
                  user.address = req.body.address;
              }
              if (req.body.isAdmin) {
                  user.isAdmin = req.body.isAdmin;
              }
              if (req.body.isSuperAdmin) {
                  user.isSuperAdmin = req.body.isSuperAdmin;
              }
              if (req.body.role) {
                  user.role = req.body.role;
              }

              user.save((err, user) => {
                  if (err) {
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({ err: err });
                      return;
                  }
                  passport.authenticate('local')(req, res, () => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({ success: true, status: 'Registration Successful!' });
                  });
              })

          }
      });
});

//provide admin access to user

router.put('/addadmin', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.updateOne({ username: req.body.username}, {
      $set: { isAdmin: true }
  })
      .then((user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'admin privileges provided' });
      }, (err) => next(err))
      .catch((err) => next(err));
})

//revoke admin access to user

router.put('/removeadmin', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.updateOne({ username: req.body.username}, {
      $set: { isAdmin: false }
  })
      .then((user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'admin privileges revoked' });
      }, (err) => next(err))
      .catch((err) => next(err));
})

//delete user

// router.delete('/',authenticate.verifyUser ,authenticate.verifyAdmin ,(req, res, next) => {
//   User.remove({username : req.body.username})
//   .then((resp) => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json({success: true , status: 'user removed'});
//   }, (err) => next(err))
//   .catch((err) => next(err));
// });

router.post('/login', passport.authenticate('local'), (req, res) => {
  let token = authenticate.getToken({_id: req.user._id , isAdmin : req.user.isAdmin , isSuperAdmin : req.user.isSuperAdmin});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

// router.get('/logout', passport.authenticate('local') , (req, res) => {
//   if (req.session) {
//     req.session.destroy();
//     res.clearCookie('session-id');
//     res.redirect('/');
//   }
//   else {
//     let err = new Error('You are not logged in!');
//     err.status = 403;
//     next(err);
//   }
// });

module.exports = router;
