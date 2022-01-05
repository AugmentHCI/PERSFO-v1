import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { NutrientsBar } from "/imports/ui/components/NutrientsBar";
import { RecommendedRecipes } from '/imports/db/recommendedRecipes/RecommendedRecipes';
import { useTracker } from "meteor/react-meteor-data";

export const Food4MeContent = ({ recipe }) => {

    const [componentHeight, setComponentHeight] = useState(window.innerHeight);

    const useStyles = makeStyles(() => ({
        ecoscore: {
            height: "64px",
        },
        subtitle: {
            color: "#717171",
            width: "100%",
            display: "flex",
            fontSize: "12px",
            alignItems: "center",
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "0px",
            textTransform: "uppercase",
        },
    }));

    const classes = useStyles();

    const { lowExplanations,highExplanations, totalValue } = useTracker(() => {
        const noDataAvailable = { lowExplanations: [], highExplanations: [] };
        const recommendationHandler = Meteor.subscribe("recommendedrecipes");
        if (!recipe || !Meteor.user() || !recommendationHandler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }

        const recommendedRecipes = RecommendedRecipes.findOne({ userid: Meteor.userId() }).recommendations;
        const explanations = _.filter(_.sortBy(recommendedRecipes, r => -r.food4meRanking)[0].explanations, e => e.value !== 0);

        let totalValue = 0;
        explanations.forEach(e => totalValue += Math.abs(e.value));

        const lowExplanations = _.filter(explanations, e => e.rating == "LOW");
        const highExplanations = _.filter(explanations, e => e.rating == "HIGH");

        return { lowExplanations,highExplanations, totalValue };
    });

    return (
        <>
            <h1 className={classes.subtitle}>Persoonlijk advies</h1>
            <div style={{
                overflowY: "scroll",
                height: componentHeight - 325 - 65 - 30 - 60 + "px",
            }}>
                <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
                    Je wordt aangeraden om meer {_.map(lowExplanations, (e => e.food4me + " "))} te nuttigen. Deze maaltijd is rijk aan:
                </p>
                {_.map(lowExplanations, (explanation) => {
                    return (<NutrientsBar
                        key={explanation.food4me + "-key"}
                        title={explanation.food4me}
                        value={(Math.abs(explanation.value)/totalValue)}
                        maxValue={1}
                        hideMaxValue={true}
                        color={"#F57D20"}
                        unit={"(bijdrage)"}
                    />)
                })}
                <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
                    Je krijg al veel {_.map(highExplanations, (e => e.food4me + " "))} binnen, deze maaltijd is daarom arm aan:
                </p>
                {_.map(highExplanations, (explanation) => {
                    return (<NutrientsBar
                        key={explanation.food4me + "-key"}
                        title={explanation.food4me}
                        value={Math.abs(explanation.value)/totalValue}
                        maxValue={1}
                        hideMaxValue={true}
                        color={"#F57D20"}
                        unit={"(bijdrage)"}
                    />)
                })}

            </div>
        </>
    );
};