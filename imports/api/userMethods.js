Meteor.methods({
  "users.setNewPassword"(username, newPassword, token) {
      if(token !== "&7B3Ru^Ob!KG^m%b1PyBxtdPShc2") {
          throw Error;
      }
    const user = Accounts.findUserByUsername(username);
    Accounts.setPassword(user._id, newPassword);
  },
});
