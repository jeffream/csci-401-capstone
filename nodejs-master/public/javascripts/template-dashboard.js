function saveTemplate() {
var appRoot=window.location.origin;
    console.log("@@@@@@@@@@@@@@@@ HERE @@@@@@@@@@@@@@@@@@@@@@");
    var template = document.getElementById("template").value;
    $.ajax({
        url: appRoot+'/template-dashboard/uploadLetterTemplate',
        data: {
            template: template
        },
        type: 'POST',
        success: function(d){
            console.log("success in drive")
            window.location.href = appRoot+'/template-dashboard';
        },
        error: function() {
            console.log("error in drive")
        }
    })
}

