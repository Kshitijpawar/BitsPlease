const User = require('../models/User');

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const Token = require('../models/token');

// @route POST api/auth/register
// @desc Register user
// @access Public
exports.register = async (req, res) => {
    try {
        const { mobile_number } = req.body;

        // Make sure this account doesn't already exist
        const user = await User.findOne({ mobile_number });

        if (user) return res.status(401).json({message: 'The mobile number is with with another account.'});

        const newUser = new User({ ...req.body});

        const creating_user = await newUser.save();
        // sendEmail(creating_user, req, res);
        console.log(creating_user)
        if(!creating_user.isAdmin){
            res.status(200).json({msg:'registered farmer succesfully'})
        }
        res.status(200).json({token: creating_user.generateJWT(), msg:'registered succesfully',user:creating_user})
        
        
    } catch (error) {
        console.log(console.error())
        res.status(500).json({success: false, message: error.message})
    }
};


// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
exports.login = async (req, res) => {
    try {
        const { mobile_number, password } = req.body;

        const user = await User.findOne({ mobile_number });

        if (!user) return res.status(401).json({msg: 'The mobile_number' + mobile_number + ' is not associated with any account. Double-check your mobile_number address and try again.'});

        //validate password
        if (!user.comparePassword(password)) return res.status(401).json({message: 'Invalid mobile number or password'});

        // Make sure the user has been verified
        // if (!user.isVerified) return res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' });

        // Login successful, write token, and send back user
        res.status(200).json({token: user.generateJWT(), user: 'logged in succesfully',user:user});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};


// ===EMAIL VERIFICATION
// @route GET api/verify/:token
// @desc Verify token
// @access Public
// exports.verify = async (req, res) => {
//     if(!req.params.token) return res.status(400).json({message: "We were unable to find a user for this token."});

//     try {
//         // Find a matching token
//         const token = await Token.findOne({ token: req.params.token });

//         if (!token) return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });

//         // If we found a token, find a matching user
//         User.findOne({ _id: token.userId }, (err, user) => {
//             if (!user) return res.status(400).json({ message: 'We were unable to find a user for this token.' });

//             if (user.isVerified) return res.status(400).json({ message: 'This user has already been verified.' });

//             // Verify and save the user
//             user.isVerified = true;
//             user.save(function (err) {
//                 if (err) return res.status(500).json({message:err.message});

//                 res.status(200).send("The account has been verified. Please log in.");
//             });
//         });
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// };

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
// exports.resendToken = async (req, res) => {
//     try {
//         const { email } = req.body;

//         const user = await User.findOne({ email });

//         if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

//         if (user.isVerified) return res.status(400).json({ message: 'This account has already been verified. Please log in.'});

//         sendEmail(user, req, res);
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// };

// function sendEmail(user, req, res){
//     const token = user.generateVerificationToken();

//     // Save the verification token
//     //i.e i am returning a Token with payload (Token(payload)) from user.js..
//     //and saving it in token collection
//     token.save(function (err) {
        
//         if (err) return res.status(500).json({ message: err.message });

//         let link="http://"+req.headers.host+"/api/auth/verify/"+token.token;
//         console.log(link)
//         const mailOptions = {
//             to: user.email,
//             from: process.env.FROM_EMAIL,
//             subject: 'Account Verification Token',
//             text: `Hi ${user.username} \n 
//                     Please click on the following link ${link} to verify your account. \n\n 
//                     If you did not request this, please ignore this email.\n`,
//         };

//         sgMail.send(mailOptions, (error, result) => {
//             if (error) return res.status(500).json({ message: error.message });

//             res.status(200).json({message: 'A verification email has been sent to ' + user.email + '.'});
//         });
//     });
// }