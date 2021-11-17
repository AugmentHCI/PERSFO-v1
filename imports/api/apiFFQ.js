import { FFQCollection } from "../db/surveys/FFQCollection";
import { UserPreferences } from "../db/userPreferences/UserPreferences";

const token = "";
const language = "en-US"
const url = "https://quisper.onsafecape.gr/FFQ/questionnaire?lang=";
const food4meURL = "https://api.quisper.eu/nutrient-intake-values/beta/ffq/1";


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

export function food4me(FFQ) {
    let call = HTTP.call("POST", food4meURL, {
        headers: {
            "x-api-key": "dOETXx7hPv7aJHKUMlLfJ3NxhEY9UFEe8UPf19K9",
            Accept: "application/json",
        },
        data: FFQ
    });

    if (call.data) {
        console.log(call.data);
        UserPreferences.upsert(
            { userid: this.userId },
            { $addToSet: { food4me: call.data } }
        );
    }
}

