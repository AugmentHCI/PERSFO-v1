const token = "";
const language = "nl-NL"
const url = "https://quisper.onsafecape.gr/FFQ/questionnaire?lang=";


var fs = require("fs");

export function initFFQ() {
    let call = HTTP.call("GET", url + language, {
        headers: {
            Accept: "application/json",
        },
    });
    if (call.data) {
        console.log(call.data)
    }
}

