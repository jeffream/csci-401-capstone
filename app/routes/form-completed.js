var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET form entry page. */
router.get('/', verify, function(req, res, next) {
    res.render('pages/form-completed', {
        title: 'Form Completed!',
    });

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
          user: 'letterofrecgenerator@gmail.com', // generated ethereal user
          pass: 'USC*summer!'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });

    var email = req.user.email;
    console.log("Email is: ", email);
    console.log("Form data: ", req.body.responseData);

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Letter of Rec Generator" <letterofrecgenerator@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Letter of Recommendation - Form Completed', // Subject line
        text: req.body.email + ' has completed your recommendation request.', // plain text body
        // html: '<p>' + req.body.body_text + ' ' + url + '</p>'// html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });
});



module.exports = router;
