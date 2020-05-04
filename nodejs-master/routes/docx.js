// var express = require('express');
// var router = express.Router();

// /* GET login page. */
// router.get('/', function (req, res, next) {
//     res.render('pages/docx', {
//         title: 'DOCX DEMO',
//         subtitle: '', 
//         url: 'pages/docx'
//     });
// });

// module.exports = router;
var Form = require('../models/form');
var credentials = require('../config/auth');
var googleAuth = require('google-auth-library');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var letterParser = require('./letter-parser');

const docx = require('docx');
const fs = require('fs');
const request = require('request');
const express = require('express');
const router = express.Router();

const { Document, Paragraph, Packer } = docx;

// https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
/*const download = (uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};*/

//const URL = 'https://raw.githubusercontent.com/dolanmiu/docx/ccd655ef8be3828f2c4b1feb3517a905f98409d9/demo/images/cat.jpg';

router.get('/', async(req, res) => {
    
    const doc = new Document();
    const paragraph1 = new Paragraph("I am writing this letter as a recommendation for Tommy Trojan’s application to the MBA program at Harvard Business School. Tommy was a student of mine in CSCI 201 (Principles of SoftwareDevelopment) during the spring 2017 semester and earned a solid A in the class. She also took CSCI 401(Capstone: Design and Construction of Large Software Systems) with me in fall 2017 and earned a solid A in that class as well.");
    const paragraph2 = new Paragraph("\n" + "I am writing this letter as a recommendation for Tommy Trojan’s application to the MBA program at Harvard Business School. Tommy was a student of mine in CSCI 201 (Principles of SoftwareDevelopment) during the spring 2017 semester and earned a solid A in the class. She also took CSCI 401(Capstone: Design and Construction of Large Software Systems) with me in fall 2017 and earned a solid A in that class as well.");
    const paragraph3 = new Paragraph("\n" + "I am writing this letter as a recommendation for Tommy Trojan’s application to the MBA program at Harvard Business School. Tommy was a student of mine in CSCI 201 (Principles of SoftwareDevelopment) during the spring 2017 semester and earned a solid A in the class. She also took CSCI 401(Capstone: Design and Construction of Large Software Systems) with me in fall 2017 and earned a solid A in that class as well.");
    const paragraph4 = new Paragraph("\n" + "I am writing this letter as a recommendation for Tommy Trojan’s application to the MBA program at Harvard Business School. Tommy was a student of mine in CSCI 201 (Principles of SoftwareDevelopment) during the spring 2017 semester and earned a solid A in the class. She also took CSCI 401(Capstone: Design and Construction of Large Software Systems) with me in fall 2017 and earned a solid A in that class as well.");
    const paragraph5 = new Paragraph("\n" + "I am writing this letter as a recommendation for Tommy Trojan’s application to the MBA program at Harvard Business School. Tommy was a student of mine in CSCI 201 (Principles of SoftwareDevelopment) during the spring 2017 semester and earned a solid A in the class. She also took CSCI 401(Capstone: Design and Construction of Large Software Systems) with me in fall 2017 and earned a solid A in that class as well.");
    const paragraph6 = new Paragraph("\n" + "I am writing this letter as a recommendation for Tommy Trojan’s application to the MBA program at Harvard Business School. Tommy was a student of mine in CSCI 201 (Principles of SoftwareDevelopment) during the spring 2017 semester and earned a solid A in the class. She also took CSCI 401(Capstone: Design and Construction of Large Software Systems) with me in fall 2017 and earned a solid A in that class as well.");
    
    var letter = req.body.letter;
    doc.addParagraph(letter);
    
    doc.addParagraph(paragraph1);
    doc.addParagraph(paragraph2);
    doc.addParagraph(paragraph3);
    doc.addParagraph(paragraph4);
    doc.addParagraph(paragraph5);
    doc.addParagraph(paragraph6);
    doc.addParagraph(paragraph6);

    const image = doc.createImage(fs.readFileSync('./signatureexample.jpg'), 200,200);

    doc.Header.createImage(fs.readFileSync('./headerexample.jpg'), 1200,250);
	doc.Footer.createImage(fs.readFileSync('./footerexample.jpg'), 1200,250);
    
    const packer = new Packer();

    const b64string = await packer.toBase64String(doc);

    res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
    res.send(Buffer.from(b64string, 'base64'));
   


});

module.exports = router;