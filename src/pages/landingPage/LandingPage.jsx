import React from 'react';
import Timeline from '../timeline/Timeline'; // This imports from the timeline folder
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Timeline />
    </div>
  );
}