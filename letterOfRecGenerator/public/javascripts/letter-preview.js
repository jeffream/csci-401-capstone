var id = parseAttribute('id');

var innerContainer;
var form;
var letterHTML;
var templateData;
var tagRegex = /\<\![a-z0-9_]+\>/ig;

const EMAIL_SUBECT_TEXT_AREA_ID = "email-subject-text-area";
const EMAIL_BODY_TEXT_AREA_ID = "email-body-text-area";
const EMAIL_TEMPLATES = "email-templates";

// Letter Preview Editing
const ADD_QUESTION_MODAL_ID = "add-question-modal";
const LETTER_CONTAINER_ID = "letter-container";
const TRIX_EDITOR = "trix-editor";
const OUTER_CONTAINER = "outer-container";
var edited = false;
var formatted;

function onLoad() {
    $.ajax({
        url: 'http://localhost:3000/letter-preview/form',
        data: {id},
        type: 'GET',
        success: function (data) {
            form = data;
            $.ajax({
                url: 'http://localhost:3000/template-editor/template',
                data: {id: data.template._id,
                        saveSwitchData: true},
                type: 'GET',
                success: function (dat) {
                    console.log('page load success');
                    letterHTML = createLetterPreview(form, form.letter);
                }
            });
        },
        error: function () {
            console.log('error');
        }
    });
}

function getQueryVariable(){
    /*var query = window.location.search.substring(1);
    var vars = query.split("&");
    for(var i=0;i<vars.length;i++){
        var pair = vars[i].split("=");
        if(pair[0] == variable){
            return pair[1];
        }
    }*/
    document.getElementById("id1").value = "cok";

}

function showEditModal(clicked) {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    var element = document.querySelector(TRIX_EDITOR);
    element.value = "";
    element.editor.setSelectedRange([0, 0]);
    element.editor.insertHTML(innerContainer.innerHTML);
    var textt = document.getElementsByClassName("attachment__caption");
    modal.style.display = "block";
}

// Saves, exits, and updates letter preview
function saveEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    var element = document.querySelector(TRIX_EDITOR);
    var editor = document.querySelector(TRIX_EDITOR).editor;

    var child = $('#trix-editor').children().first().innerHTML;
    var length = letterHTML.length
    letterHTML = element.value;
    var inside = document.getElementsByClassName("inside");
    document.getElementById(LETTER_CONTAINER_ID).innerHTML = letterHTML;
    editor.setSelectedRange([0, editor.getDocument().getLength()])
    editor.deleteInDirection("forward");

    $.ajax({
        url: 'http://localhost:3000/letter-preview/save',
        data: {
            id: id,
            letter: letterHTML
        },
        type: 'POST',
        success: function (data) {
            console.log('success in saveEditModal');
        },
        error: function () {
            console.log('error in saveEditModal');
        }
    });

    modal.style.display = "none";
    document.getElementById("downloadButton").style.display = "none";
    document.getElementById("saveButton").style.display = "block";
}

// Closes without changing
function cancelEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    modal.style.display = "none";
}

function downloadLetterOLD() {
    var datepicker = document.querySelectorAll("input[type=date]")[0]
    var date = datepicker.value
    $.ajax({
        url: 'http://localhost:3000/letter-preview/drive',
        data: {
            id:id,
            letter: letterHTML,
            date: date
        },
        type: 'POST',
        success: function(d){
            console.log("success in drive")
            window.location.href = 'http://localhost:3000/recommender-dashboard';
        },
        error: function() {
            console.log("error in drive")
        }
    })
}

function saveLetter() {
    event.preventDefault();
    var idt = document.getElementById("id1").value;
    var date = document.getElementById("theDate").value;
    $.ajax({
        url: 'http://localhost:3000/letter-preview/templateUpload',
        data: {
            id:id,
            letter: letterHTML,
            formID: idt,
            date: date
        },
        type: 'POST',
        success: function(d){
            console.log("letter saved successfully")
            document.getElementById("downloadButton").style.display = "block";
            document.getElementById("saveButton").style.display = "none";
            alert('Document saved');
            //window.location.href = 'http://localhost:3000/recommender-dashboard';
        },
        error: function() {
            console.log("error saving letter")
        }
    })
}

function downloadLetter() {
    event.preventDefault();
    $.ajax({
        url: 'http://localhost:3000/letter-preview/downloads',
        type: 'GET',
        success: function(d) {
            console.log("letter download success");
            window.open('http://localhost:3000/letter-preview/downloads?foo=bar&xxx=yyy');
        },
        error: function() {
            console.log("letter download error");
        }
    })
}


function test(){
    $.ajax({
        url: 'http://localhost:3000/letter-preview/test',
        data: {
            id: id
        },
        type: 'POST',
        success: function(d){
            console.log("success in drive")
            window.location.href = 'http://localhost:3000/recommender-dashboard';
        },
        error: function() {
            console.log("error in drive")
        }
    })
}

function getDestinationRoute(address, params) {
    return address + '?, params=' + params
}

// Creates the divs for each item in array
function createLetterPreview(form, letter) {
    $(function() {
        var letterContainer = document.createElement('div');
        letterContainer.id = LETTER_CONTAINER_ID;
        innerContainer = document.createElement('div');
        innerContainer.id = 'print';
        letterContainer.onclick = function (e) {
            showEditModal(this.id);
        };
        letterContainer.style.cursor = 'pointer';
        var outerContainer = document.getElementById(OUTER_CONTAINER);

        if (letter) {
            letterHTML = letter;
        } else {
            letterHTML = parseLetter(form);
        }

        innerContainer.innerHTML += '<div id = "letter-text" style="white-space: pre-line">' + letterHTML + '</div>';

        letterContainer.appendChild(innerContainer);
        outerContainer.appendChild(letterContainer);
        return innerContainer.innerHTML;
    });
}
function parseLetter(form) {
    var letter = form.template.text;
    var letter_html = decodeLetterHTML(letter);
    var responses = form.responses;

    var noCapitalization = Array.from(letter_html.replace(tagRegex, function (match) {
        var response = responses.find(function (item) {
            return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
        });
        return response ? response.response : '';
    }).replace(tagRegex, function (match) {
        var response = responses.find(function (item) {
            return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
        });
        return response ? response.response : '';
    }));

    for (var i = 0; i < noCapitalization.length; i++) {

        // Found ending punctuation that isn't the last letter in the text
        if ((noCapitalization[i] == '.' || noCapitalization[i] == '?' || noCapitalization[i] == '!') && i != noCapitalization.length - 1) {

            // Make sure exclamation point is not from a tag
            if (noCapitalization[i] == '!' && i > 0 && noCapitalization[i - 1] == '<') {
                continue;
            }

            // Look for the next alphabetical character to capitalize
            var j = i + 1;
            while (!((noCapitalization[j] >= 'a' && noCapitalization[j] <= 'z') || (noCapitalization[j] >= 'A' && noCapitalization[j] <= 'Z')) && j < noCapitalization.length) {
                j++;
            }

            // Found character to capitalize
            if (j < noCapitalization.length) {
                noCapitalization[j] = noCapitalization[j].toUpperCase();
            }
        }
    }
    return noCapitalization.join("");
}

function parseEmailLetter(body) {

    $.ajax({
        url: 'http://localhost:3000/email-letter-preview/emailForm',
        data: {id},
        type: 'GET',
        success: function (data) {
            form = data.form;
            var letter = body;
            var responses = form.responses;
            var noCapitalization = Array.from(letter.replace(tagRegex, function (match) {
                var response = responses.find(function (item) {
                    return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
                });
                return response ? response.response : '';
            }).replace(tagRegex, function (match) {
                var response = responses.find(function (item) {
                    return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
                });
                return response ? response.response : '';
            }));

            for (var i = 0; i < noCapitalization.length; i++) {

                // Found ending punctuation that isn't the last letter in the text
                if ((noCapitalization[i] == '.' || noCapitalization[i] == '?' || noCapitalization[i] == '!') && i != noCapitalization.length - 1) {

                    // Make sure exclamation point is not from a tag
                    if (noCapitalization[i] == '!' && i > 0 && noCapitalization[i - 1] == '<') {
                        continue;
                    }

                    // Look for the next alphabetical character to capitalize
                    var j = i + 1;
                    while (!((noCapitalization[j] >= 'a' && noCapitalization[j] <= 'z') || (noCapitalization[j] >= 'A' && noCapitalization[j] <= 'Z')) && j < noCapitalization.length) {
                        j++;
                    }

                    // Found character to capitalize
                    if (j < noCapitalization.length) {
                        noCapitalization[j] = noCapitalization[j].toUpperCase();
                    }
                }
            }

            var parsed_letter = noCapitalization.join("");
            document.getElementById("email-body-text-area").value = parsed_letter;

        },
        error: function () {
            console.log('error in parseLetter');
        }
    });
}

function parseAttribute(attr) {
    return document.currentScript.getAttribute(attr) == '\'\'' ? null : document.currentScript.getAttribute(attr).replace(/['"]+/g, '');
}

function encodeLetterHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/gi, '<br>');
}

function decodeLetterHTML(text) {
    text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#039;/g, "'").replace(/\<span class\="tag"\>/gi, '').replace(/\<\/span\>/gi, '').replace(/\<div\>/gi, '\n').replace(/\<\/div\>/gi, '').replace(/\<br\>/gi, '\n').replace(/\&nbsp;/g, ' ');
    text = text.replace(/\<strong\>\<\!/gi, "<!").replace(/\<\/strong\>/gi, '');
    text = text.replace(/\<strong\>/gi, '');
    return text;
}

function addEmailHistory() {
    var Email = {
        title: document.getElementById(EMAIL_TEMPLATES).value,
        subject: document.getElementById(EMAIL_SUBECT_TEXT_AREA_ID).value,
        body_text: document.getElementById(EMAIL_BODY_TEXT_AREA_ID).value
    };

    $.ajax({
        url: 'http://localhost:3000/letter-preview/addEmailHistory',
        data: {
            id: id,
            Email: Email
        },
        type: 'POST',
        complete: function () {
            console.log('complete');
        },
        success: function (data) {
            id = data.id;
            console.log('addEmailHistory success');
            window.location.href = 'http://localhost:3000/history'
        },
        error: function () {
            console.log('addEmailHistory error');
        }
    });
}

function displayTemplate() {
    if(document.getElementById('example-template').style.display == "none") {
        document.getElementById('example-template').style.display = "block";
    }
    else {
        document.getElementById('example-template').style.display = "none";
    }
}

$(document).ready(function(){
    setTimeout(function(){
        var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
        var element = document.querySelector(TRIX_EDITOR);
        element.value = "";
        element.editor.setSelectedRange([0, 0]);
        element.editor.insertHTML(innerContainer.innerHTML);
        var textt = document.getElementsByClassName("attachment__caption");
        modal.style.display = "block";
        saveEditModal();
    },500);
});
