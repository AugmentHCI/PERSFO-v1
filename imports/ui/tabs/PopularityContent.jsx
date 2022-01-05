import { makeStyles } from "@material-ui/core/styles";
import { useTracker } from "meteor/react-meteor-data";
import React, { useState } from "react";
import { RecommendedRecipes } from '/imports/db/recommendedRecipes/RecommendedRecipes';

export const PopularityContent = ({ recipe }) => {

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

    const { nblikedRanking } = useTracker(() => {
        const noDataAvailable = { nblikedRanking: 0 };
        const recommendationHandler = Meteor.subscribe("recommendedrecipes");
        if (!recipe || !Meteor.user() || !recommendationHandler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }

        const recommendedRecipes = RecommendedRecipes.findOne({ userid: Meteor.userId() }).recommendations;
        const nblikedRanking = _.sortBy(recommendedRecipes, r => -r.pop)[0].nblikedRanking

        return { nblikedRanking };
    });

    return (
        <>
            <h1 className={classes.subtitle}>Populariteitmaaltijd</h1>
            <div style={{
                overflowY: "scroll",
                height: componentHeight - 325 - 65 - 30 - 60 + "px",
            }}>
                <p style={{ color: "#afafaf", fontSize: "11px", padding: "8px" }}>
                    Deze maaltijd staat op rang: {nblikedRanking}
                </p>
            </div>
        </>
    );
};