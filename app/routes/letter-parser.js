var express = require('express');
var User = require('../models/user');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
                "November", "December"];


exports.htmlstuff = function(form) {
    var text = form;
    text = text.replace(/\<\/strong\>/gi, '');
    text = text.replace(/\<strong\>/gi, '');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/\u00a0/g, " ");
    text = text.replace(/\//g, '');
    text = text.replace(/<div\s*\/?>/gi,' ');
    text = text.replace(/\&nbsp;/g, ' ');
    return text;
}

exports.getDate = function(rawDate) {
    var arr = [];
    arr = rawDate.split('-');
    year = arr[0];
    month = parseInt(arr[1]);
    day = arr[2];
    var date = months[month-1] + " " + day + ", " + year;
    return date;

}

function parseLetter(form) {
    var tagRegex = /\<\![a-z0-9_]+\>/ig;
    var letter = form;
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

    return noCapitalization.join("");

}