// Dashboard.jsx
import React from 'react';
import HeaderComponent from "./Header/Header";
import HomeComponent from "./Home/Home";
import AsanasAddedByUser from './AsasnsAddedByUser/AsanasAddedByUser';
import ViewAsanas from "./View-Asanas/ViewAsanas";
import CreateClassSession from "./Create-session/Create-session";

const Dashboard = () => {
  const smoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -50; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard">
      <HomeComponent id="home" />
      <AsanasAddedByUser></AsanasAddedByUser>
    </div>
  );
};

export default Dashboard;
