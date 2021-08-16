import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTracker } from "meteor/react-meteor-data";
import React from "react";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import { FFQCollection } from "../db/surveys/FFQCollection";
import { HexadCollection } from "../db/surveys/HexadCollection";


const useStyles = makeStyles((persfoTheme) => ({
    title: {
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "Roboto",
        margin: "4px",
        marginTop: "20px",
        color: "#726f6c",
    },
}));

const componentName = "SurveyForm";
export const SurveyForm = () => {
    const classes = useStyles();

    const { json } = useTracker(() => {
        const noDataAvailable = { json: [] };
        if (!Meteor.user()) {
            return noDataAvailable;
        }
        const handlerFFQ = Meteor.subscribe("survey-ffq");
        if (!handlerFFQ.ready()) {
            return { ...noDataAvailable };
        }
        const handlerHexad = Meteor.subscribe("survey-hexad");
        if (!handlerHexad.ready()) {
            return { ...noDataAvailable };
        }

        let pages = [];
        const surveyFFQ = FFQCollection.find({}, { sort: { version: -1, limit: 1 } }).fetch()[0].survey;
        const surveyHexad = HexadCollection.find({}, { sort: { version: -1, limit: 1 } }).fetch()[0].survey;

        pages = pages.concat(surveyHexad, surveyFFQ);

        let json = {
            pages: [],
            showProgressBar: "bottom",
        };


        pages.forEach(page => {
            // per Page
            let description = "";
            let questions = [];

            if (page.Questions) {

                // per question per page
                page.Questions.forEach(question => {
                    questions.push(parseQuestion(question));
                });

                // in case of combined questions
            } if (page.CombinedQuestions) {

                page.CombinedQuestions.forEach(subQuestion => {
                    // per question per page
                    subQuestion.Questions.forEach(question => {
                        question.Title = question.Title + " - " + subQuestion.Title;
                        questions.push(parseQuestion(question));
                    });
                });
                description = page.Subtitle;
            }
            json.pages.push({ title: page.Title, description: description, name: page.ID, questions: questions })

        });

        return { json };
    });

    function parseQuestion(question) {
        const QuestionID = question.ID;
        const QuestionTitle = question.Title.replace(/<BR\/>/i, "\n").replace(/\(optioneel\)/i, "\n"); //TODO remove optional from more languages
        let visible = "true";

        if (question.DependsOn) {
            // TODO: depend on certain answer, query 
            visible = "{" + question.DependsOn + "} notempty";
        }

        if (question.DependsOn != null) {
            // TODO"Q54 DependsOn": "Q53", "DisabledWhen": "1"
        }
        switch (question.QuestionType) {
            case 0:
                // parse answer in SurveyJS format
                let answers = [];
                question.Answers.forEach(answer => {
                    answers.push({ quisperValue: +answer.Value, text: answer.Answer });
                })

                return {
                    type: "radiogroup",
                    choices: answers,
                    isRequired: false,
                    name: QuestionID,
                    title: QuestionTitle,
                    visibleIf: visible
                };
            case 2:
                return {
                    type: "text",
                    inputType: "number",
                    name: QuestionID,
                    title: QuestionTitle,
                    placeHolder: "",
                    isRequired: false,
                    autoComplete: "name",
                    visibleIf: visible
                }
            default:
                break;
        }
    }

    //Define a callback methods on survey complete
    const onComplete = (survey, options) => {
        //Write survey results into database
        console.log("Survey results: " + JSON.stringify(survey.data));

        let parsedOutput = { ...survey.data }; //clone
        _.each(survey.data, (value, key) => {
            parsedOutput[key] = value.quisperValue >= 0 ? value.quisperValue : value; // >= confusion 0 and undefined
        });

        console.log(parsedOutput);
        Meteor.call('users.saveSurvey', parsedOutput);
    }

    var defaultThemeColors = Survey
        .StylesManager
        .ThemeColors["default"];
    defaultThemeColors["$main-color"] = "#F57D20";
    defaultThemeColors["$header-color"] = "#F57D20";
    defaultThemeColors["$body-background-color"] = "#F9F1EC";
    defaultThemeColors["$body-container-background-color"] = "#fff";


    Survey
        .StylesManager
        .applyTheme();

    var model = new Survey.Model(json);

    model.showQuestionNumbers = "off";

    return (
        <Container>
            <h1 className={classes.title}>Onboarding questionnaires</h1>
            <Survey.Survey model={model} onComplete={onComplete} />
        </Container>
    );
};
