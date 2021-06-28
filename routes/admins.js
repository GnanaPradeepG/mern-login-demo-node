let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
let passport = require('passport');

let User = require('../models/user');
let authenticate = require('../authenticate');

router.use(bodyParser.json());

//  super admin level controls

/* GET users listing*/
router.get('/', authenticate.verifyUser, authenticate.verifySuperAdmin, (req, res, next) => {
    User.find({ })
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
})

router.get('/admins', authenticate.verifyUser, authenticate.verifySuperAdmin, (req, res, next) => {
    User.find({ $or: [ { isAdmin : true }, { isSuperAdmin : true } ] })
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
})

// Add users with any level of access to listing
router.post('/adduser', authenticate.verifyUser, authenticate.verifySuperAdmin, (req, res, next) => {
    User.register(new User({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            }
            else {
                if (req.body.organization) {
                    user.organization = req.body.organization;
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

//provide admin previleges 
router.put('/addadmin', authenticate.verifyUser, authenticate.verifySuperAdmin, (req, res, next) => {
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

// provide super admin previleges 
router.put('/addsuperadmin', authenticate.verifyUser, authenticate.verifySuperAdmin, (req, res, next) => {
    User.updateOne({ username: req.body.username }, {
        $set: { isSuperAdmin: true }
    })
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'super admin privileges provided' });
        }, (err) => next(err))
        .catch((err) => next(err));
})

//remove admin previleges 
router.put('/removeadmin', authenticate.verifyUser, authenticate.verifySuperAdmin, (req, res, next) => {
    User.updateOne({ username: req.body.username }, {
        $set: { isAdmin: false }
    })
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'admin privileges revoked' });
        }, (err) => next(err))
        .catch((err) => next(err));
})

// remove super admin previleges 

router.put('/removesuperadmin', authenticate.verifyUser, authenticate.verifySuperAdmin, (req, res, next) => {
    User.updateOne({ username: req.body.username }, {
        $set: { isSuperAdmin: false }
    })
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'super admin privileges revoked' });
        }, (err) => next(err))
        .catch((err) => next(err));
})

//   Delete users

  router.delete('/',authenticate.verifyUser ,authenticate.verifySuperAdmin ,(req, res, next) => {
    User.remove({username : req.body.username})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true , status: 'user removed'});
    }, (err) => next(err))
    .catch((err) => next(err));
  });

module.exports = router;
