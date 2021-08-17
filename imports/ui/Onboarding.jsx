import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MuiAlert from "@material-ui/lab/Alert";
import { Meteor } from "meteor/meteor";
import { Typography } from "@material-ui/core";
import React, { useState } from "react";

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

const componentName = "Onboarding";
export const Onboarding = () => {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <Typography variant="h5" align="justify" color="textSecondary" paragraph>
                Thank you for joining the EIT-Food persfo study!
            </Typography>
            <Typography variant="body1" align="justify" color="textSecondary" paragraph>
                Tijdens deze EIT-FOOD PERSFO studie willen we onderzoeken hoe we u kunnen ondersteunen bij het kiezen van gezondere maaltijden.
                Het doel van deze studie is om u steeds een advies op maat te geven, daarom zullen we u eerst enkele vragenlijsten voorstellen. 
                De eerste vragenlijst zal daarom polsen naar uw voedingsgewoontes zodat we u gepersonliseerd advies kunnen geven op basis van nutrienten. 
                Ten tweede willen we ook onderzoeken in welke rol motivatie een rol speelt bij het volgen van gepersonliseerd advies. Daarom polt de tweede vragenlijst naar uw motivatie om gezonder te willen eten.
                Ten slotte voeren we een korte profieltest uit, om zo de resultaten van het onderzoek te kunnen kaderen.
            </Typography>
            <Typography variant="body1" align="justify" color="textSecondary" paragraph>
                Indien u deelneemt aan deze studie, gebruikt u een studieversie van onze applicatie en heeft u een rechtstreekse inbreng in het onderzoek. Via deze rechtstreekse inbreng willen we ervoor zorgen dat de PERSFO-softwareapplicatie aan uw noden en wensen kan voldoen.
            </Typography>
        </Container>
    );
};
