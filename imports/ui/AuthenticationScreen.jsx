import { useTracker } from "meteor/react-meteor-data";
import React, { Fragment, useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";


export const AuthenticationScreen = () => {
  // account logic
  const [existingUser, setExistingUser] = useState(true);

  return (
    <>
      <div className="main">
        {existingUser ? (
          <LoginForm setExistingUser={setExistingUser}/>
        ) : (
          <RegisterForm setExistingUser={setExistingUser}/>
        )}
      </div>
    </>
  );
};
