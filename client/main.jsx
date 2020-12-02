import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import { MealScreen } from '/imports/ui/MealScreen';

Meteor.startup(() => {
  // render(<MealScreen/>, document.getElementById('react-target'));
  render(<App/>, document.getElementById('react-target'));
});
