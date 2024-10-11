import React from 'react';

const Home = (props) => {
  console.log(props.user);
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>This is the main page of your Firebase React application.</p>
    </div>
  );
};

export default Home;