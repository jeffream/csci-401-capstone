var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var nodemailer = require('nodemailer');
var credentials = require('../config/auth');
var googleAuth = require('google-auth-library');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var letterParser = require('./letter-parser');
//const HummusRecipe = require('hummus-recipe');
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');


//const Readable = require('stream').Readable;
//const fileUpload = require('express-fileupload');
//const opn = require('opn')
//const downloadsFolder = require('downloads-folder');

//docx stuff
const docx = require('docx');
const request = require('request');
const { Document, Paragraph, Packer } = docx;


router.get('/', function (req, res, next) {
    req.user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log("get /  error in letter-preivew: " + err );
        } else {
            res.render('pages/letter-preview', {
                title: form.email,
                id: req.query.id,
                form: form,
            });
        }
    });
});

router.get('/form', function (req, res, next) {
    req.user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log(err);
        } else {
            res.json(form);
        }
    });
});


router.post('/save', function (req, res, next) {
    Form.completeForm(req.body.id, req.body.letter, function (err, form) {
        if (err) {
            console.log(err);
        } else {
            res.render('pages/letter-preview', {
                title: form.email,
                id: req.query.id,
                form: form,
            });
        }
    });
});

router.post('/templateUpload', function (req,res, next) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    const filePath = __dirname + '/uploads/' + 'letterTemplate';
    try{
        if(fs.existsSync(filePath)){
            console.log("IT EXISTS");
                    //template is uploaded
            console.log("Template uploaded!");
            
            console.log(req.body.formID);
            var user = req.user;
            console.log("user:**********************");
            console.log(user._id);

            var pulled_text; //text that were getting and moving to docxtemplater
            //console.log(req.query.id);
            //console.log(req);
            console.log("^^^^^^^");
           // console.log(req.user.forms);

            user.getForm(req.body.formID, function (err, form) {
            if (err) {
                console.log(err);
            } else {

                //console.log(form);
                pulled_text = form.letter;
                res.json(form);

                console.log(pulled_text);
                var formatted_text = letterParser.htmlstuff(pulled_text);

                var content = fs
                        .readFileSync(filePath, 'binary');

                var zip = new JSZip(content);

                var doc = new Docxtemplater();
                doc.loadZip(zip);
                //enable linebreaks
                doc.setOptions({linebreaks:true});

                console.log("2");
                //set the templateVariables
                var date_raw = req.body.date;
                var actual_date = letterParser.getDate(date_raw);
                doc.setData({
                    
                    //text with the line breaks included
                    date: actual_date,
                    description: formatted_text
                });

                try {
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render()
                }
                catch (error) {
                    var e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    }
                    console.log(JSON.stringify({error: e}));
                    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                    throw error;
                }
                console.log("3");
                var buf = doc.getZip()
                 .generate({type: 'nodebuffer'});

                // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                fs.writeFileSync(path.resolve('./routes/uploads', 'output.docx'), buf);
                
                console.log("4");  
            }
            });
        }
        else{
            //it doesnt exist
            //create file using blank page
        console.log("Template not uploaded");
        console.log(req.body.formID);
        var user = req.user;
        console.log("user:**********************");
        console.log(user._id);

        var pulled_text; //text that were getting and moving to docxtemplater

        //console.log(req.body.formID);
        user.getForm(req.body.formID, function (err, form) {
        if (err) {
            console.log(err);
        } else {

            //console.log(form.letter);
            pulled_text = form.letter;
            res.json(form);

            console.log(pulled_text);
            var formatted_text = letterParser.htmlstuff(pulled_text);

            var content = fs
                    .readFileSync(path.resolve('./routes/uploads', 'input.docx'), 'binary');

            var zip = new JSZip(content);

            var doc = new Docxtemplater();
            doc.loadZip(zip);
            //enable linebreaks
            doc.setOptions({linebreaks:true});

            console.log("2");
            //set the templateVariables
            doc.setData({
                
                //text with the line breaks included
                description: formatted_text
            });

            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            }
            catch (error) {
                var e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                }
                console.log(JSON.stringify({error: e}));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }
            console.log("3");
            var buf = doc.getZip()
             .generate({type: 'nodebuffer'});

            // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
            fs.writeFileSync(path.resolve('./routes/uploads', 'output.docx'), buf);
            console.log("4");  
        }
        });

        }
    } catch(err){
        console.log(err);
    }

   
    /*console.log(req.files.file);
    var file = req.files.file;
    console.log("*************");
    console.log(file.name);
    if(file){
    	//template is uploaded
    	console.log("Template uploaded!");
    	

    	var user = req.user;
    	console.log("user:**********************");
    	console.log(user._id);

    	var pulled_text; //text that were getting and moving to docxtemplater
    	//console.log(req.query.id);
    	console.log(req);
    	console.log("^^^^^^^");
    	console.log(req.user.forms);

    	user.getForm(req.body.ingroup1, function (err, form) {
        if (err) {
            console.log(err);
        } else {

        	//console.log(form);
        	pulled_text = form.letter;
            res.json(form);

    		console.log(pulled_text);
    		var formatted_text = letterParser.htmlstuff(pulled_text);

    		var content = fs
				    .readFileSync(file.name, 'binary');

			var zip = new JSZip(content);

			var doc = new Docxtemplater();
			doc.loadZip(zip);
			//enable linebreaks
			doc.setOptions({linebreaks:true});

			console.log("2");
			//set the templateVariables
			doc.setData({
			    
			    //text with the line breaks included
			    description: formatted_text
			});

			try {
			    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
			    doc.render()
			}
			catch (error) {
			    var e = {
			        message: error.message,
			        name: error.name,
			        stack: error.stack,
			        properties: error.properties,
			    }
			    console.log(JSON.stringify({error: e}));
			    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
			    throw error;
			}
			console.log("3");
			var buf = doc.getZip()
	         .generate({type: 'nodebuffer'});

			// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
			fs.writeFileSync(path.resolve('./routes/uploads', 'output.docx'), buf);
			//res.setHeader('Content-disposition', 'attachment; filename=rec.docx');
			//res.send(Buffer.from(b64string, 'base64'));
			console.log("4");  
        }
    	});
   		


    }else{ //if theres no template uploaded
    	console.log("Template not uploaded");

    	var user = req.user;
    	console.log("user:**********************");
    	console.log(user._id);

    	var pulled_text; //text that were getting and moving to docxtemplater

    	user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log(err);
        } else {

        	//console.log(form.letter);
        	pulled_text = form.letter;
            res.json(form);

            console.log("gotdamnit");
    		console.log(pulled_text);
    		var formatted_text = letterParser.htmlstuff(pulled_text);

    		var content = fs
				    .readFileSync(path.resolve('./routes/uploads', 'input.docx'), 'binary');

			var zip = new JSZip(content);

			var doc = new Docxtemplater();
			doc.loadZip(zip);
			//enable linebreaks
			doc.setOptions({linebreaks:true});

			console.log("2");
			//set the templateVariables
			doc.setData({
			    
			    //text with the line breaks included
			    description: formatted_text
			});

			try {
			    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
			    doc.render()
			}
			catch (error) {
			    var e = {
			        message: error.message,
			        name: error.name,
			        stack: error.stack,
			        properties: error.properties,
			    }
			    console.log(JSON.stringify({error: e}));
			    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
			    throw error;
			}
			console.log("3");
			var buf = doc.getZip()
	         .generate({type: 'nodebuffer'});

			// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
			fs.writeFileSync(path.resolve('./routes/uploads', 'output.docx'), buf);
			console.log("4");  
        }
    	});
   		
		
    } */

})

router.post('/drive', function(req,res,next) {
    console.log("DRIVE DRIVE DRIVE DRIVE DRIVE DRIVE")
    var user = req.user;
    user.getForm(req.body.id, function(err, form) {
        if(err){
            console.log(err)
        } else {
            var break_lines = "<br><br>";
            var smaller_break_lines = "<br><br>";
            var date_raw = req.body.date;
            var actual_date = letterParser.getDate(date_raw);
            var formatted_date = break_lines + actual_date + smaller_break_lines;
            var letter = req.body.letter;
            var formatted_letter = formatted_date + letter;
            var template = form.getTemplate();
            var templateName = template.name;
           // console.log("THIS IS FORMATTED:" + formatted_letter);

            var text = letterParser.htmlstuff(formatted_letter);
            var longText = text.replace(/(\r\n|\n|\r)/gm, "<br>");
            //text = text.replace(/(\n)/gm, '')
            var fname = form.responses[0].response;
            var lname = form.responses[1].response;
            var length = longText.length;
            //console.log("TEXT:" + text)
            //var stringWords = longText.split(' ');
           // console.log("words: " + stringWords)
            var para = longText.split("<br>"); //split para into an array of paragraphs
            //var para2 = longText.replace(/<br\s*[\/]?>/gi, "\n");
           
           //create doc for docx
          /* const doc = new Document();
            
            //loop through para array and make a paragraph for each
            for (var x in para) {
                const temp_paragraph = new Paragraph(para[x]);
                doc.addParagraph(temp_paragraph);
                console.log(para[x]);
            }

            //place header, footer signature
    


            const packer = new docx.Packer();

            packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync("MyDocument4.docx", buffer);
            });
            */

            //load the docx file as a binary
			var content = fs
			    .readFileSync(path.resolve('./routes/uploads', 'input.docx'), 'binary');

			var zip = new JSZip(content);

			var doc = new Docxtemplater();
			doc.loadZip(zip);
			//enable linebreaks
			doc.setOptions({linebreaks:true});


			//set the templateVariables
			doc.setData({
			    
			    //text with the line breaks included
			    description: text
			});

			try {
			    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
			    doc.render()
			}
			catch (error) {
			    var e = {
			        message: error.message,
			        name: error.name,
			        stack: error.stack,
			        properties: error.properties,
			    }
			    console.log(JSON.stringify({error: e}));
			    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
			    throw error;
			}
			var buf = doc.getZip()
             .generate({type: 'nodebuffer'});

			// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
			fs.writeFileSync(path.resolve('./routes/uploads', 'output.docx'), buf);

            console.log("we made it");
                
            
            
            res.redirect('/recommender-dashboard');
        }

    });
})

router.get('/downloads', function(req, res) {
    var file = path.resolve('./routes/uploads', 'output.docx');
    res.download(file);
});




module.exports = router;