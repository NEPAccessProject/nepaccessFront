import React from 'react';
import { useNavigate } from 'react-router-dom';

//Needed to upgraded to V6.x of react-router-dom which has additonal support for Serve package
export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    return (
      <Component
        navigate={navigate}
        {...props}
        />
    );
  };

  return Wrapper;
};