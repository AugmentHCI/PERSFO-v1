import { FFQCollection } from "../db/surveys/FFQCollection";

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
        const lastEntry = FFQCollection.find({}, { sort: { version: -1, limit: 1 } }).fetch()[0];
        if (lastEntry) {
            if (lastEntry.version < call.data.Version) {
                FFQCollection.insert({ version: call.data.Version, survey: call.data.Groups });
            }
        } else {
            FFQCollection.insert({ version: call.data.Version, survey: call.data.Groups });
        }
    }
}

