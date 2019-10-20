var id = parseAttribute('id');
const EMAIL_TITLE_ID = "name-container-text-field";
const EMAIL_SUBECT_TEXT_AREA_ID = "email-subject-text-area";
const EMAIL_BODY_TEXT_AREA_ID = "email-body-text-area";
var errors = [];
var errorScrollCoordinates = {
    x: 0,
    y: 0
};


window.onload = function () {

};

function loadDefaultTemplates() {
   var subject; 
   var body;
}

function parseAttribute(attr) {
    return document.currentScript.getAttribute(attr) == '' ? null : document.currentScript.getAttribute(attr);
}

function saveEmailTemplate() {
    
    var Email = {
        title: document.getElementById(EMAIL_TITLE_ID).value,
        subject: document.getElementById(EMAIL_SUBECT_TEXT_AREA_ID).value,
        body_text: document.getElementById(EMAIL_BODY_TEXT_AREA_ID).value
    };

    if (id) {

        $.ajax({
            url: 'http://localhost:3000/email-template-editor/update',
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
                console.log('success');
                window.location.href = 'http://localhost:3000/template-dashboard'
            },
            error: function () {
                console.log('error');
            }
        });

       
    } else {

        $.ajax({
            url: 'http://localhost:3000/email-template-editor/addEmailTemplate',
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
                console.log('success');
                window.location.href = 'http://localhost:3000/template-dashboard'
            },
            error: function () {
                console.log('error');
            }
        });
    }
}

function setScrollCoordinates(header) {
    if (errorScrollCoordinates.x != 0 || errorScrollCoordinates.y != 0 || !header) {
        return;
    }

    var rect = header.getBoundingClientRect();
    errorScrollCoordinates.x = rect.left + window.scrollX;
    errorScrollCoordinates.y = rect.top + window.scrollY;
}

function clearErrors() {
    for (var i = 0; i < errors.length; i++) {
        errors[i].field.classList.remove('error');
        if (errors[i].error) {
            errors[i].error.remove();
        }
        if (errors[i].fill) {
            errors[i].fill.remove();
        }
    }

    errors.length = 0;
    errorScrollCoordinates.x = 0;
    errorScrollCoordinates.y = 0;
}

function validate(template) {
    clearErrors();
    var isValid = true;

    if (isNotValid(template.title)) {
        var textField = document.getElementById(EMAIL_TITLE_ID);
        addError(textField, 0, 'template title is required');
        isValid = false;
    }

    if (isNotValid(template.subject)) {
        var textField = document.getElementById(EMAIL_SUBECT_TEXT_AREA_ID);
        addError(textField, 0, 'template subject is required');
        isValid = false;
    }

    if (isNotValid(template.body_text)) {
        var textField = document.getElementById(EMAIL_BODY_TEXT_AREA_ID);
        addError(textField, 0, 'template body is required');
        isValid = false;
    }
    return isValid;
}

function isNotValid(field) {
    return !field || field.trim() === '';
}

function addError(field, index, message) {
    field.classList.add('error');
    var container = getErrorContainer(field);
    var header = getSectionHeader(container);
    var errorElements = addErrorToContainer(container, index, message);

    errors.push({
        field: field,
        error: errorElements.errorList,
        fill: errorElements.fill
    });

    setScrollCoordinates(header);
}

function addErrorToContainer(container, index, message) {
    if (!container.lastChild.classList || !container.lastChild.classList.contains('error-column-container')) {
        addErrorListToErrorContainer(container);
    }

    var errorList = container.lastChild;
    var fill = container.firstChild;
    var error = getErrorHTML(message);
    errorList.children[index].appendChild(error);

    return {
        errorList: errorList,
        fill: fill
    };
}

function addErrorListToErrorContainer(container) {
    var errorList = document.createElement("div");
    errorList.classList.add('error-column-container');
    errorList.style.width = '15vw';

    var innerContainer = getInnerContainer(container);

    for (var i = 0; i < innerContainer.children.length; i++) {
        var child = innerContainer.children[i];

        if (child.classList && child.classList.contains('multiple-choices-container')) {
            for (var j = 0; j < child.children.length; j++) {
                var multipleChoiceContainer = child.children[j];

                if (multipleChoiceContainer.classList && multipleChoiceContainer.classList.contains('multiple-choice-container')) {
                    if (multipleChoiceContainer.firstChild.children.length > 2) {
                        for (var k = 0; k < 3; k++) {
                            errorList.appendChild(getFillHTML(getAbsoluteHeight(multipleChoiceContainer.firstChild.children[k])));
                        }
                    } else {
                        errorList.appendChild(getFillHTML(getAbsoluteHeight(multipleChoiceContainer.firstChild.firstChild)));
                        errorList.appendChild(getFillHTML(getAbsoluteHeight(multipleChoiceContainer.firstChild.lastChild)));
                    }
                } else {
                    var fill = getFillHTML(getAbsoluteHeight(multipleChoiceContainer));
                    errorList.appendChild(fill);
                }
            }
        } else {
            var fill = getFillHTML(getAbsoluteHeight(child));
            errorList.appendChild(fill);
        }
    }

    container.appendChild(errorList);

    var fill = document.createElement("div");
    fill.classList.add('fill');
    fill.style.width = '15vw';
    container.insertBefore(fill, container.firstChild);
}

function getInnerContainer(container) {
    for (var i = 0; i < container.children.length; i++) {
        var child = container.children[i];

        if (!child.classList) {
            continue;
        }

        if (child.id === 'letter-container' || child.id === 'name-container') {
            return child;
        }

        if (child.classList.contains('question-outer-container')) {
            return child.getElementsByClassName('question-container')[0];
        }
    }

    return null;
}

function setScrollCoordinates(header) {
    if (errorScrollCoordinates.x != 0 || errorScrollCoordinates.y != 0 || !header) {
        return;
    }

    var rect = header.getBoundingClientRect();
    errorScrollCoordinates.x = rect.left + window.scrollX;
    errorScrollCoordinates.y = rect.top + window.scrollY;
}

function getErrorContainer(field) {
    var parentContainer = field.parentElement;

    while (parentContainer) {
        if (parentContainer.classList.contains('error-container')) {
            return parentContainer;
        }

        parentContainer = parentContainer.parentElement;
    }

    return parentContainer;
}


function getErrorContainer(field) {
    var parentContainer = field.parentElement;

    while (parentContainer) {
        if (parentContainer.classList.contains('error-container')) {
            return parentContainer;
        }

        parentContainer = parentContainer.parentElement;
    }

    return parentContainer;
}

function getSectionHeader(container) {
    if (container.previousElementSibling.classList.contains('section-header') || container.previousElementSibling.classList.contains('question-header')) {
        return container.previousElementSibling;
    }

    return null;
}

function getAbsoluteHeight(element) {
    var style = window.getComputedStyle(element);
    var margin = parseFloat(style['marginTop']) + parseFloat(style['marginBottom']);

    return Math.ceil(element.offsetHeight + margin);
}

function getErrorHTML(message) {
    var error = document.createElement("div");
    error.classList.add('arrow-box');
    error.innerHTML = getErrorMessage(message);

    return error;
}


function getFillHTML(height) {
    var fill = document.createElement("div");
    fill.style.height = height + 'px';
    fill.classList.add('error-list-item');

    return fill;
}

function getErrorMessage(message) {
    return '\<p class="arrow-text"\>Error: ' + message + '.\</p\>'
}

function isTagNotValid(tag) {
    return !/\<\![a-z0-9_]+\>/i.test(tag);
}

function deemphasizeTags() {
    var letterHTML = document.getElementById(LETTER_TEXT_AREA_ID).innerHTML;
    document.getElementById(LETTER_TEXT_AREA_ID).innerHTML = letterHTML.replace(/\<span class\="tag"\>/gi, '').replace(/\<span class\="tag-unknown"\>/gi, '').replace(/\<\/span\>/gi, '');
}

function emphasizeTags() {
    var letterHTML = document.getElementById(LETTER_TEXT_AREA_ID).innerHTML;
    var letterHTMLWithTagEmphasis = letterHTML.replace(/&lt;\![a-z0-9_]+&gt;/gi, function (match) {
        if (unknownTags.find(function (tag) {
                return tag === match;
            })) {
            return '<span class="tag-unknown">' + match + '</span>';
        }

        return '<span class="tag">' + match + '</span>';
    });
    letterHTMLWithTagEmphasis = isNotValid(letterHTMLWithTagEmphasis) ? letterHTML : letterHTMLWithTagEmphasis;
    document.getElementById(LETTER_TEXT_AREA_ID).innerHTML = letterHTMLWithTagEmphasis.replace(/\<div\>\<br\>\<\/div\>/gi, '<br>').replace(/\<div\>/gi, '<br>').replace(/\<\/div\>/gi, '');
}