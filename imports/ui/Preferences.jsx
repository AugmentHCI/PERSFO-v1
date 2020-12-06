import { Checkbox, MenuItem, Select, Slider, Switch } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";

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

  const [MilkBox, setMilkBox] = useState(false);
  const [EggsBox, setEggsBox] = useState(false);
  const [NutsBox, setNutsBox] = useState(false);
  const [PeanutsBox, setPeanutsBox] = useState(false);
  const [ShellBox, setShellBox] = useState(false);
  const [WheatBox, setWheatBox] = useState(false);
  const [SoyBox, setSoyBox] = useState(false);
  const [FishBox, setFishBox] = useState(false);
  // Checkbox
  const handleMilkBox = (event, newValue) => {
    setMilkBox(newValue);
  };
  const handleEggsBox = (event, newValue) => {
    setEggsBox(newValue);
  };
  const handleNutsBox = (event, newValue) => {
    setNutsBox(newValue);
  };
  const handlePeanutsBox = (event, newValue) => {
    setPeanutsBox(newValue);
  };
  const handleShellBox = (event, newValue) => {
    setShellBox(newValue);
  };
  const handleWheatBox = (event, newValue) => {
    setWheatBox(newValue);
  };
  const handleSoyBox = (event, newValue) => {
    setSoyBox(newValue);
  };
  const handleFishBox = (event, newValue) => {
    setFishBox(newValue);
  };

  const handleChange = (event, newValue) => {};
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
          <div className={classes.sliderContainer}>
            <div className={classes.checkbox}>
              <div className={classes.innerCheckbox}>
                <Checkbox
                  color="primary"
                  checked={MilkBox}
                  onChange={handleMilkBox}
                />
                <div className={classes.sliderTitle}>Cow's Milk</div>
              </div>
              <Select className={classes.select}>
                <MenuItem value={1}>Severe</MenuItem>
                <MenuItem value={2}>Moderate</MenuItem>
              </Select>
            </div>
          </div>

          <div className={classes.sliderContainer}>
            <div className={classes.checkbox}>
              <div className={classes.innerCheckbox}>
                <Checkbox
                  color="primary"
                  checked={EggsBox}
                  onChange={handleEggsBox}
                />
                <div className={classes.sliderTitle}>Eggs</div>
              </div>
              <Select className={classes.select}>
                <MenuItem value={1}>Severe</MenuItem>
                <MenuItem value={2}>Moderate</MenuItem>
              </Select>
            </div>
          </div>

          <div className={classes.sliderContainer}>
            <div className={classes.checkbox}>
              <div className={classes.innerCheckbox}>
                <Checkbox
                  color="primary"
                  checked={NutsBox}
                  onChange={handleNutsBox}
                />
                <div className={classes.sliderTitle}>Tree Nuts</div>
              </div>
              <Select className={classes.select}>
                <MenuItem value={1}>Severe</MenuItem>
                <MenuItem value={2}>Moderate</MenuItem>
              </Select>
            </div>
          </div>

          <div className={classes.sliderContainer}>
            <div className={classes.checkbox}>
              <div className={classes.innerCheckbox}>
                <Checkbox
                  color="primary"
                  checked={PeanutsBox}
                  onChange={handlePeanutsBox}
                />
                <div className={classes.sliderTitle}>Peanuts</div>
              </div>
              <Select className={classes.select}>
                <MenuItem value={1}>Severe</MenuItem>
                <MenuItem value={2}>Moderate</MenuItem>
              </Select>
            </div>
          </div>

          <div className={classes.sliderContainer}>
            <div className={classes.checkbox}>
              <div className={classes.innerCheckbox}>
                <Checkbox
                  color="primary"
                  checked={ShellBox}
                  onChange={handleShellBox}
                />
                <div className={classes.sliderTitle}>Shellfish</div>
              </div>
              <Select className={classes.select}>
                <MenuItem value={1}>Severe</MenuItem>
                <MenuItem value={2}>Moderate</MenuItem>
              </Select>
            </div>
          </div>

          <div className={classes.sliderContainer}>
            <div className={classes.checkbox}>
              <div className={classes.innerCheckbox}>
                <Checkbox
                  color="primary"
                  checked={WheatBox}
                  onChange={handleWheatBox}
                />
                <div className={classes.sliderTitle}>Wheat</div>
              </div>
              <Select className={classes.select}>
                <MenuItem value={1}>Severe</MenuItem>
                <MenuItem value={2}>Moderate</MenuItem>
              </Select>
            </div>
          </div>

          <div className={classes.sliderContainer}>
            <div className={classes.checkbox}>
              <div className={classes.innerCheckbox}>
                <Checkbox
                  color="primary"
                  checked={SoyBox}
                  onChange={handleSoyBox}
                />
                <div className={classes.sliderTitle}>Soy</div>
              </div>
              <Select className={classes.select}>
                <MenuItem value={1}>Severe</MenuItem>
                <MenuItem value={2}>Moderate</MenuItem>
              </Select>
            </div>
          </div>

          <div className={classes.sliderContainer}>
            <div className={classes.checkbox}>
              <div className={classes.innerCheckbox}>
                <Checkbox
                  color="primary"
                  checked={FishBox}
                  onChange={handleFishBox}
                />
                <div className={classes.sliderTitle}>Fish</div>
              </div>
              <Select className={classes.select}>
                <MenuItem value={1}>Severe</MenuItem>
                <MenuItem value={2}>Moderate</MenuItem>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
