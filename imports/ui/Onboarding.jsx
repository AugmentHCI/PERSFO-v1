import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { StepButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((persfoTheme) => ({
    title: {
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "Roboto",
        margin: "4px",
        marginTop: "20px",
        color: "#726f6c",
    },
    drawerImage: {
        width: 250,
        height: 107,
    },
}));

const componentName = "Onboarding";
export const Onboarding = () => {
    const classes = useStyles();

    const steps = [
        {
            label: 'PERSFO project: algemene informatie studie',
            description: "U wordt uitgenodigd om deel te nemen aan een wetenschappelijk onderzoek van de KU Leuven. Hier vindt u alle informatie aangaande dit onderzoek. U kan zelf beslissen of u al dan niet aan de studie wenst deel te nemen. Wanneer u uw deelname bevestigt, kan u deze op elk ogenblik opnieuw beëindigen en hoeft u hiervoor geen reden te geven. Dit heeft geen invloed op uw werk of uw relatie met uw werkgever. Dit informatieblad geeft u inlichtingen over de studie. Neem gerust uw tijd om het aandachtig te lezen en te beslissen of u al dan niet wenst deel te nemen. Nadien kan u uitgebreid vragen stellen zodat u zeker goed begrijpt wat van u wordt verwacht. Nadat u deze informatie hebt doorgenomen en begrijpt en al uw vragen werden beantwoord, zal u worden gevraagd het geïnformeerde toestemmingsformulier te dateren en te ondertekenen indien u besluit aan de studie deel te nemen. U ontvangt een kopie van het ondertekende toestemmingsformulier.",
        },
        {
            label: 'Inleiding',
            description: "Hoewel mensen zich er steeds meer van bewust zijn dat gezond eten belangrijk is, is de prevalentie van obesitas verdrievoudigd tussen 1975-2016. Dit suggereert dat informatiecampagnes en niet altijd leiden tot gezond eetgedrag. Deze studie maakt deel uit van een groter project, PERSFO, dat het ontwerp beoogt van een innovatief en ‘slim’ aanbevelingsplatform om werknemers gepersonaliseerd voedseladvies aan te bieden. Het PERSFO-project wil de transparantie van gepersonaliseerde voedingsadvies verhogen en ook zorgen dat het advies mensen daadwerkelijk motiveert en ondersteunt.",
        },
        {
            label: 'Doel van deze studie',
            description: "Het algemene doel van deze studie is het verkennen en ontwikkelen van een mobiele applicatie. We streven naar mobiele applicatie die de dagelijkse menu’s in Sodexo haar bedrijfsrestaurants op een transparante en interactieve manier kan voorstellen. Via dit onderzoek willen de onderzoekers meer inzicht krijgen hoe ze werknemers een beter inzicht kunnen geven in hun eetgewoontes. Specifiek willen de onderzoekers de mogelijkheden verkennen om visualisaties en aanbevelingsmethoden te combineren in een gezondheidsapplicatie. Dit om werknemers te ondersteunen om meer geïnformeerde beslissingen te kunnen nemen. Indien u deelneemt aan deze studie, gebruikt u een studieversie van onze applicatie en heeft u een rechtstreekse inbreng in het onderzoek. Via deze rechtstreekse inbreng willen we ervoor zorgen dat de PERSFO-softwareapplicatie aan uw noden en wensen kan voldoen.",
        },
        {
            label: 'Wat gebeurt er wanneer ik deelneem?',
            description: "Initieel zal u gevraagd worden om drie vragenlijsten in te vullen. De eerste, lange vragenlijst polst naar uw persoonlijke eetgewoontes. Uw antwoorden zullen gebruik worden om zowel de impact van de PERSFO-applicatie te meten, alsook om u persoonlijke aanbevelingen te geven. De tweede en derde vragenlijst zullen vervolgens polsen naar uw motivatie om gezond te eten. Na het invullen van de vragenlijsten zal u gevraagd worden om een gratis mobiele applicatie te installeren op uw smartphone via de officiële app winkels. U kan deze applicatie vervolgens gebruiken om te kijken welke maaltijden er vandaag beschikbaar zijn in het bedrijfsrestaurant. Op basis van persoonlijke doelen (die u zelf kan instellen) zullen maaltijden aanbevolen worden. Door gebruik te maken van deze applicatie kan u eventueel meer inzicht krijgen waarom maaltijden voor u aangeraden worden. Enkel en alleen wanneer u de applicatie gebruikt, zullen wij technische gebruiksgegevens loggen. Merk op dat dit enkel om technische gebruiksgegevens gaat. Deze technische informatie kan gebruikt worden om het aanbevelingssysteem te verbeteren dat inzicht geeft in menukeuzes. U zal hier geen ongemak van ondervinden. Via uw deelname geeft u enkel toestemming dat technische gebruiksgegevens met de onderzoekers gedeeld mogen worden. Tijdens de studieperiode van 8 tot 12 weken zal u vrijblijvend gevraagd worden om kort (max. 1 uur) even met een onderzoeker samen te zitten in een virtuele meeting. Dit zodat u in een informele setting feedback kan geven op uw ervaringen de mobiele applicatie. Uw feedback is immers zeer waardevol om de applicatie in verdere iteraties te verbeteren. Op het einde van de studie zal u tenslotte gevraagd worden om de vragenlijsten nogmaals in te vullen.",
        },
        {
            label: 'Wat zijn de mogelijke voor- en nadelen, risico’s en kosten van mijn deelname?',
            description: "Er zijn geen directe nadelen, risico’s of bijkomende kosten verbonden aan uw deelname. Aangezien het project verder bouwt op eerdere Europese projecten, zoals het Food4Me project, zullen we u (alleszins beperkt) gepersonaliseerd voedseladvies kunnen aanbieden.",
        },
        {
            label: 'Zal mijn deelname aan de studie vertrouwelijk blijven?',
            description: "Alle informatie die de onderzoekers verzamelen via deze testperiode is vertrouwelijk. Alleen onderzoekers van het project hebben toegang tot deze informatie. Alle medewerkers en betrokkenen in deze studie verbinden zich ertoe dat ze naar eer en geweten zullen handelen en de Europese GDPR wetgeving zullen respecteren (Verordening (EU) 2016/679 van het Europees Parlement en de Raad van 27 april 2016 betreffende de bescherming van natuurlijke personen in verband met de verwerking van persoonsgegevens en betreffende het vrije verkeer van die gegevens en tot intrekking van Richtlijn 95/46/EG (algemene verordening gegevensbescherming) en de rectificatie van 23 mei 2018).",
        },
        {
            label: 'Wat zal er gebeuren met de resultaten van de studie?',
            description: "De resultaten zullen gebruikt worden in het kader van een wetenschappelijk onderzoek. Het is mogelijk dat de resultaten worden gepubliceerd in een wetenschappelijk tijdschrift. In dit geval zal uw identiteit nooit worden vrijgegeven. Uw naam zal nooit vermeld worden.",
        },
        {
            label: 'Wie heeft de studie gecontroleerd?',
            description: "Dit onderzoeksproject is ter goedkeuring voorgelegd aan de Sociaal-maatschappelijke Ethische Commissie (SMEC) in Leuven. Het is de taak van deze commissie om na te gaan of aan alle voorwaarden betreffende de veiligheid en vrijwaring van de rechten worden voldaan. De Commissie heeft geen bezwaren kenbaar gemaakt tegen de uitvoering van dit onderzoek.",
        },
        {
            label: 'Heeft u nog verdere vragen bij de studie?',
            description: "U kan altijd contact opnemen met Robin De Croon, KU Leuven robin.decroon@kuleuven.be 016 / 37 39",
        },
        {
            label: 'Start met de studie',
            description: "Alvast bedankt voor uw interesse in onze studie. Indien u akkoord gaat met bovenstaande informatie, kan u deelnemen door hieronder op akkoord te klikken. U zal vervolgens naar de vragenlijsten overgaan.",
        }
    ];

    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        if (activeStep == steps.length - 1) {
            Meteor.call("users.finishedICF");
        }
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    return (
        <Box sx={{ maxWidth: 400 }}>
            <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {step.label}
                        </StepButton>
                        <StepContent>
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleComplete}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Ik ga akkoord' : 'Verder'}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Terug
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {/* {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )} */}
        </Box>
    );
};
