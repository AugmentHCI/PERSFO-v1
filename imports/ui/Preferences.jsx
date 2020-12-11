import { FormControlLabel, Slider, Switch } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { useTracker } from "meteor/react-meteor-data";
import React from "react";
import { capitalizeFirstLetter, makeArrayOf } from "/imports/api/auxMethods";
import { RecipesCollection, UserPreferences } from "/imports/api/methods.js";

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
    marginRight: "-12px",
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

  const {
    EnergySlider,
    TotalFatSlider,
    SatfatSlider,
    SugarSlider,
    ProteinSlider,
    SaltSlider,
    FiberSlider,
    EnergySwitch,
    TotalFatSwitch,
    SatfatSwitch,
    SugarSwitch,
    ProteinSwitch,
    SaltSwitch,
    FiberSwitch,
  } = useTracker(() => {
    const noDataAvailable = {
      EnergySlider: 0,
      TotalFatSlider: 0,
      SatfatSlider: 0,
      SugarSlider: 0,
      ProteinSlider: 0,
      SaltSlider: 0,
      FiberSlider: 0,
      EnergySwitch: false,
      TotalFatSwitch: false,
      SatfatSwitch: false,
      SugarSwitch: false,
      ProteinSwitch: false,
      SaltSwitch: false,
      FiberSwitch: false,
    };
    const handler = Meteor.subscribe("userpreferences");
    if (!handler.ready()) {
      return { ...noDataAvailable };
    }
    let nutrientGoals = [];
    let activeNutrientGoals = [];
    const userPreferences = UserPreferences.findOne({
      userid: Meteor.userId(),
    });
    let EnergySlider = 0,
      TotalFatSlider = 0,
      SatfatSlider = 0,
      SugarSlider = 0,
      ProteinSlider = 0,
      SaltSlider = 0,
      FiberSlider = 0,
      EnergySwitch = false,
      TotalFatSwitch = false,
      SatfatSwitch = false,
      SugarSwitch = false,
      ProteinSwitch = false,
      SaltSwitch = false,
      FiberSwitch = false;
    try {
      if (userPreferences.nutrientGoals) {
        nutrientGoals = userPreferences.nutrientGoals;

        EnergySlider = nutrientGoals["energy"];
        TotalFatSlider = nutrientGoals["totalFat"];
        SatfatSlider = nutrientGoals["satFat"];
        SugarSlider = nutrientGoals["sugar"];
        ProteinSlider = nutrientGoals["protein"];
        SaltSlider = nutrientGoals["salt"];
        FiberSlider = nutrientGoals["fiber"];
      }

      if (userPreferences.activeNutrientGoals) {
        activeNutrientGoals = userPreferences.activeNutrientGoals;

        EnergySwitch = activeNutrientGoals["energy"];
        TotalFatSwitch = activeNutrientGoals["totalFat"];
        SatfatSwitch = activeNutrientGoals["satFat"];
        SugarSwitch = activeNutrientGoals["sugar"];
        ProteinSwitch = activeNutrientGoals["protein"];
        SaltSwitch = activeNutrientGoals["salt"];
        FiberSwitch = activeNutrientGoals["fiber"];
      }

      return {
        EnergySlider,
        TotalFatSlider,
        SatfatSlider,
        SugarSlider,
        ProteinSlider,
        SaltSlider,
        FiberSlider,
        EnergySwitch,
        TotalFatSwitch,
        SatfatSwitch,
        SugarSwitch,
        ProteinSwitch,
        SaltSwitch,
        FiberSwitch,
      };
    } catch (error) {
      return { ...noDataAvailable };
    }
  });

  const energySliderChange = (event, newValue) => {
    Meteor.call("users.updateNutrientGoals", {
      energy: newValue,
      totalFat: TotalFatSlider,
      satFat: SatfatSlider,
      sugar: SugarSlider,
      protein: ProteinSlider,
      salt: SaltSlider,
      fiber: FiberSlider,
    });
    Meteor.call("log", componentName, "energySliderChange");
  };
  const totalFatSliderChange = (event, newValue) => {
    Meteor.call("users.updateNutrientGoals", {
      energy: EnergySlider,
      totalFat: newValue,
      satFat: SatfatSlider,
      sugar: SugarSlider,
      protein: ProteinSlider,
      salt: SaltSlider,
      fiber: FiberSlider,
    });
    Meteor.call("log", componentName, "totalFatSliderChange");
  };
  const satfatSliderChange = (event, newValue) => {
    Meteor.call("users.updateNutrientGoals", {
      energy: EnergySlider,
      totalFat: TotalFatSlider,
      satFat: newValue,
      sugar: SugarSlider,
      protein: ProteinSlider,
      salt: SaltSlider,
      fiber: FiberSlider,
    });
    Meteor.call("log", componentName, "satfatSliderChange");
  };
  const sugarSliderChange = (event, newValue) => {
    Meteor.call("users.updateNutrientGoals", {
      energy: EnergySlider,
      totalFat: TotalFatSlider,
      satFat: SatfatSlider,
      sugar: newValue,
      protein: ProteinSlider,
      salt: SaltSlider,
      fiber: FiberSlider,
    });
    Meteor.call("log", componentName, "sugarSliderChange");
  };
  const proteinSliderChange = (event, newValue) => {
    Meteor.call("users.updateNutrientGoals", {
      energy: EnergySlider,
      totalFat: TotalFatSlider,
      satFat: SatfatSlider,
      sugar: SugarSlider,
      protein: newValue,
      salt: SaltSlider,
      fiber: FiberSlider,
    });
    Meteor.call("log", componentName, "proteinSliderChange");
  };
  const saltSliderChange = (event, newValue) => {
    Meteor.call("users.updateNutrientGoals", {
      energy: EnergySlider,
      totalFat: TotalFatSlider,
      satFat: SatfatSlider,
      sugar: SugarSlider,
      protein: ProteinSlider,
      salt: newValue,
      fiber: FiberSlider,
    });
    Meteor.call("log", componentName, "saltSliderChange");
  };
  const fiberSliderChange = (event, newValue) => {
    Meteor.call("users.updateNutrientGoals", {
      energy: EnergySlider,
      totalFat: TotalFatSlider,
      satFat: SatfatSlider,
      sugar: SugarSlider,
      protein: ProteinSlider,
      salt: SaltSlider,
      fiber: newValue,
    });
    Meteor.call("log", componentName, "fiberSliderChange");
  };

  const energySwitchChange = (event, newValue) => {
    Meteor.call("users.updateActiveNutrientGoals", {
      energy: newValue,
      totalFat: TotalFatSwitch,
      satFat: SatfatSwitch,
      sugar: SugarSwitch,
      protein: ProteinSwitch,
      salt: SaltSwitch,
      fiber: FiberSwitch,
    });
    Meteor.call("log", componentName, "energySwitchChange");
  };
  const totalFatSwitchChange = (event, newValue) => {
    Meteor.call("users.updateActiveNutrientGoals", {
      energy: EnergySwitch,
      totalFat: newValue,
      satFat: SatfatSwitch,
      sugar: SugarSwitch,
      protein: ProteinSwitch,
      salt: SaltSwitch,
      fiber: FiberSwitch,
    });
    Meteor.call("log", componentName, "totalFatSwitchChange");
  };
  const satfatSwitchChange = (event, newValue) => {
    Meteor.call("users.updateActiveNutrientGoals", {
      energy: EnergySwitch,
      totalFat: TotalFatSwitch,
      satFat: newValue,
      sugar: SugarSwitch,
      protein: ProteinSwitch,
      salt: SaltSwitch,
      fiber: FiberSwitch,
    });
    Meteor.call("log", componentName, "satfatSwitchChange");
  };
  const sugarSwitchChange = (event, newValue) => {
    Meteor.call("users.updateActiveNutrientGoals", {
      energy: EnergySwitch,
      totalFat: TotalFatSwitch,
      satFat: SatfatSwitch,
      sugar: newValue,
      protein: ProteinSwitch,
      salt: SaltSwitch,
      fiber: FiberSwitch,
    });
    Meteor.call("log", componentName, "sugarSwitchChange");
  };
  const proteinSwitchChange = (event, newValue) => {
    Meteor.call("users.updateActiveNutrientGoals", {
      energy: EnergySwitch,
      totalFat: TotalFatSwitch,
      satFat: SatfatSwitch,
      sugar: SugarSwitch,
      protein: newValue,
      salt: SaltSwitch,
      fiber: FiberSwitch,
    });
    Meteor.call("log", componentName, "proteinSwitchChange");
  };
  const saltSwitchChange = (event, newValue) => {
    Meteor.call("users.updateActiveNutrientGoals", {
      energy: EnergySwitch,
      totalFat: TotalFatSwitch,
      satFat: SatfatSwitch,
      sugar: SugarSwitch,
      protein: ProteinSwitch,
      salt: newValue,
      fiber: FiberSwitch,
    });
    Meteor.call("log", componentName, "saltSwitchChange");
  };
  const fiberSwitchChange = (event, newValue) => {
    Meteor.call("users.updateActiveNutrientGoals", {
      energy: EnergySwitch,
      totalFat: TotalFatSwitch,
      satFat: SatfatSwitch,
      sugar: SugarSwitch,
      protein: ProteinSwitch,
      salt: SaltSwitch,
      fiber: newValue,
    });
    Meteor.call("log", componentName, "fiberSwitchChange");
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

    let tempAllergens = _.map(recipe.allergens, (value, allergen) => {
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
          <Switch
            color="primary"
            checked={allergenCheckboxes[i]}
            onChange={(e) => handleAllergenCheckboxChange(e, i)}
          />
        }
        label={capitalizeFirstLetter(allergen.allergen.split("_").join(" "))}
        labelPlacement="start"
      />
    );
  };

  return (
    <div className={classes.mainWindow}>
      <h1 className={classes.title}>Configure your goals</h1>

      <div className={classes.formContainer}>
        <h1 className={classes.subtitle}>Set your desired maximum nutrient value</h1>
        <div className={classes.form}>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>
              Energy ({EnergySlider} kcal)
            </div>
            <div className={classes.slider}>
              <Slider
                disabled={!EnergySwitch}
                value={EnergySlider}
                onChange={energySliderChange}
                min={0}
                max={5000}
                valueLabelDisplay="auto"
              />
              <Switch
                color="primary"
                checked={EnergySwitch}
                onChange={energySwitchChange}
              />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>
              Total Fat ({TotalFatSlider} g)
            </div>
            <div className={classes.slider}>
              <Slider
                disabled={!TotalFatSwitch}
                value={TotalFatSlider}
                onChange={totalFatSliderChange}
                min={0}
                max={200}
                valueLabelDisplay="auto"
              />
              <Switch
                color="primary"
                checked={TotalFatSwitch}
                onChange={totalFatSwitchChange}
              />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>
              Saturated Fats ({SatfatSlider} g)
            </div>
            <div className={classes.slider}>
              <Slider
                disabled={!SatfatSwitch}
                value={SatfatSlider}
                onChange={satfatSliderChange}
                min={0}
                max={200}
                valueLabelDisplay="auto"
              />
              <Switch
                color="primary"
                checked={SatfatSwitch}
                onChange={satfatSwitchChange}
              />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Sugars ({SugarSlider} g)</div>
            <div className={classes.slider}>
              <Slider
                disabled={!SugarSwitch}
                value={SugarSlider}
                onChange={sugarSliderChange}
                min={0}
                max={200}
                valueLabelDisplay="auto"
              />
              <Switch
                color="primary"
                checked={SugarSwitch}
                onChange={sugarSwitchChange}
              />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>
              Proteins ({ProteinSlider} g)
            </div>
            <div className={classes.slider}>
              <Slider
                disabled={!ProteinSwitch}
                value={ProteinSlider}
                onChange={proteinSliderChange}
                min={0}
                max={200}
                valueLabelDisplay="auto"
              />
              <Switch
                color="primary"
                checked={ProteinSwitch}
                onChange={proteinSwitchChange}
              />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Salt ({SaltSlider} g)</div>
            <div className={classes.slider}>
              <Slider
                disabled={!SaltSwitch}
                value={SaltSlider}
                onChange={saltSliderChange}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
              <Switch
                color="primary"
                checked={SaltSwitch}
                onChange={saltSwitchChange}
              />
            </div>
          </div>
          <div className={classes.sliderContainer}>
            <div className={classes.sliderTitle}>Fiber ({FiberSlider} g)</div>
            <div className={classes.slider}>
              <Slider
                disabled={!FiberSwitch}
                value={FiberSlider}
                onChange={fiberSliderChange}
                min={0}
                max={200}
                valueLabelDisplay="auto"
              />
              <Switch
                color="primary"
                checked={FiberSwitch}
                onChange={fiberSwitchChange}
              />
            </div>
          </div>
        </div>
      </div>

      <h1 className={classes.title}>Save your allergies</h1>
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
