import {
  Checkbox,
  MenuItem,
  Select,
  Slider,
  Switch,
  FormControlLabel,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { useTracker } from "meteor/react-meteor-data";
import { RecipesCollection, UserPreferences } from "/imports/api/methods.js";
import React, { useState } from "react";
import { makeArrayOf, capitalizeFirstLetter } from "/imports/api/auxMethods";

const useStyles = makeStyles((persfoTheme) => ({
  mainWindow: {
    height: "100vh",
    overflowY: "scroll",
  },
  title: {
    color: "#726f6c",
    margin: "16px 0px 16px 8px",
    fontSize: "18px",
    fontFamily: "Roboto",
    fontWeight: 600,
  },
  subtitle: {
    color: "#726f6c",
    marginBottom: "16px",
    fontSize: "13px",
    fontFamily: "Roboto",
    fontWeight: 600,
  },
  formContainer: {
    background: "white",
    borderRadius: "25px",
    padding: "16px",
    borderRadius: "30px 0px 0px 30px",
    marginLeft: "16px",
    color: "#717171",
    fontFamily: "sans-serif",
  },
  sliderContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "8px",
  },
  sliderTitle: {
    display: "flex",
    color: "#717171",
    fontSize: "12px",
  },
  slider: {
    display: "flex",
  },
  checkbox: {
    display: "flex",
    justifyContent: "space-between",
  },
  innerCheckbox: {
    display: "flex",
    alignItems: "center",
  },
  select: {
    width: "120px",
    marginRight: "24px",
  },
}));

const componentName = "Preferences";
export const Preferences = () => {
  const classes = useStyles();

  const [EnergySlider, setEnergySlider] = useState(0);
  const [TotalFatSlider, setTotalFatSlider] = useState(0);
  const [SatfatSlider, setSatfatSlider] = useState(0);
  const [SugarSlider, setSugarSlider] = useState(0);
  const [ProteinSlider, setProteinSlider] = useState(0);
  const [SaltSlider, setSaltSlider] = useState(0);
  const [FiberSlider, setFiberSlider] = useState(0);

  // Sliders
  const energySliderChange = (event, newValue) => {
    setEnergySlider(newValue);
  };
  const totalFatSliderChange = (event, newValue) => {
    setTotalFatSlider(newValue);
  };
  const satfatSliderChange = (event, newValue) => {
    setSatfatSlider(newValue);
  };
  const sugarSliderChange = (event, newValue) => {
    setSugarSlider(newValue);
  };
  const proteinSliderChange = (event, newValue) => {
    setProteinSlider(newValue);
  };
  const saltSliderChange = (event, newValue) => {
    setSaltSlider(newValue);
  };
  const fiberSliderChange = (event, newValue) => {
    setFiberSlider(newValue);
  };

  const { allergens, allergenCheckboxes } = useTracker(() => {
    const noDataAvailable = {
      allergens: [],
      allergenCheckboxes: makeArrayOf(false, 34),
    };
    const recipeHandler = Meteor.subscribe("recipes");
    const preferencesHandler = Meteor.subscribe("userpreferences");

    if (!Meteor.user()) {
      return noDataAvailable;
    }
    if (!recipeHandler.ready() || !preferencesHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    const recipe = RecipesCollection.findOne({});
    const preferences = UserPreferences.findOne({ userid: Meteor.userId() });
    let userAllergens = [];
    try {
      userAllergens = preferences.allergens;
    } catch (error) {
      // no allergens set yet
    }

    let  tempAllergens = _.map(recipe.allergens, (value, allergen) => {
      let userPresent = _.find(userAllergens, (ua) => ua.allergen === allergen);
      userPresent = userPresent ? userPresent.present : 0;
      return {
        allergen: allergen,
        present: userPresent,
      };
    });
    const allergens = _.sortBy(tempAllergens, "allergen");
    const allergenCheckboxes = _.map(
      allergens,
      (allergen) => !!allergen.present
    );

    return { allergens, allergenCheckboxes };
  });

  const handleAllergenCheckboxChange = (event, i) => {
    let newArr = [...allergenCheckboxes];
    newArr[i] = event.target.checked;
    let listAllergens = [];
    for (let i = 0; i < newArr.length; i++) {
      let check = newArr[i];
      if (check) {
        listAllergens.push({
          allergen: allergens[i].allergen,
          present: 1,
        });
      }
    }
    Meteor.call("users.updateAllergens", listAllergens);
    Meteor.call("log", componentName, "handleAllergenCheckboxChange");
  };

  const getAllergenBar = (allergen, i) => {
    return (
      <FormControlLabel
        className={classes.checkbox}
        key={"bar-" + allergen.allergen}
        control={
          <Checkbox
            color="primary"
            checked={allergenCheckboxes[i]}
            onChange={(e) => handleAllergenCheckboxChange(e, i)}
          />
        }
        label={capitalizeFirstLetter(allergen.allergen.replaceAll("_", " "))}
        labelPlacement="start"
      />
    );
  };

  return (
    <div className={classes.mainWindow}>
      <h1 className={classes.title}>FOOD PREFERENCES</h1>

      <div className={classes.formContainer}>
        <h1 className={classes.subtitle}>Nutrients</h1>
        <div className={classes.form}>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Energy</div>
            <div className={classes.slider}>
              <Slider value={EnergySlider} onChange={energySliderChange} />
              <Switch color="primary" checked={true} />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Total Fat</div>
            <div className={classes.slider}>
              <Slider value={TotalFatSlider} onChange={totalFatSliderChange} />
              <Switch color="primary" checked={true} />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Saturated Fats</div>
            <div className={classes.slider}>
              <Slider value={SatfatSlider} onChange={satfatSliderChange} />
              <Switch color="primary" checked={true} />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Sugars</div>
            <div className={classes.slider}>
              <Slider value={SugarSlider} onChange={sugarSliderChange} />
              <Switch color="primary" checked={true} />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Proteins</div>
            <div className={classes.slider}>
              <Slider value={ProteinSlider} onChange={proteinSliderChange} />
              <Switch color="primary" checked={true} />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Salt</div>
            <div className={classes.slider}>
              <Slider value={SaltSlider} onChange={saltSliderChange} />
              <Switch color="primary" checked={true} />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Fiber</div>
            <div className={classes.slider}>
              <Slider value={FiberSlider} onChange={fiberSliderChange} />
              <Switch color="primary" checked={true} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={classes.formContainer}
        style={{ marginTop: "16px", marginBottom: "200px" }}
      >
        <h1 className={classes.subtitle}>Allergies</h1>
        <div className={classes.form}>
          {_.map(allergens, (allergen, i) => getAllergenBar(allergen, i))}
        </div>
      </div>
    </div>
  );
};
