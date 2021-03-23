import './Dashboard.scss';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

const Dashboard: FC = () => {
  return (
    <div className="Dashboard">
      <div className="intro">
        <p>
          This is an example of how to build a complex web application. Feel free to explore each
          page and download the source code available on{' '}
          <a target="_blank" rel="noreferrer" href="https://github.com/LuukvE/Luuk.gg">
            Github
          </a>
          . Both the client and server are written in{' '}
          <a target="_blank" rel="noreferrer" href="https://www.typescriptlang.org">
            TypeScript
          </a>
          , using{' '}
          <a target="_blank" rel="noreferrer" href="https://reactjs.org">
            React
          </a>{' '}
          and{' '}
          <a target="_blank" rel="noreferrer" href="https://nodejs.org">
            NodeJS
          </a>{' '}
          respectively. If you need tips on how to develop apps or just want to chat, use the{' '}
          <NavLink to="/messenger">Messenger</NavLink> page,{' '}
          <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/luukvanegeraat">
            LinkedIn
          </a>{' '}
          or{' '}
          <a target="_blank" rel="noreferrer" href="mailto:l.vanegeraat@gmail.com">
            l.vanegeraat@gmail.com
          </a>
          .
        </p>
        <img src="/luuk.jpg" alt="" />
      </div>

      <div>
        <NavLink className="icon" to="/career">
          <i className="fas fa-code" /> Career
        </NavLink>
        <ul>
          <li>
            Implements the{' '}
            <a target="_blank" rel="noreferrer" href="https://docs.github.com/en/graphql">
              Github GraphQL API
            </a>{' '}
            and{' '}
            <a target="_blank" rel="noreferrer" href="https://developers.google.com/maps">
              Google Maps API
            </a>
          </li>
          <li>Displays the number of code contributions I made on a calendar</li>
          <li>Displays a world map with markers of places I worked at</li>
        </ul>
      </div>
      <div>
        <NavLink className="icon" to="/cooking">
          <i className="fas fa-utensils" /> Cooking
        </NavLink>
        <ul>
          <li>
            Implements the{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://developers.google.com/identity/protocols/oauth2"
            >
              Google oAuth API
            </a>{' '}
            and{' '}
            <a target="_blank" rel="noreferrer" href="https://aws.amazon.com/s3">
              AWS S3 API
            </a>
          </li>
          <li>Displays a list of recipes with filters and sort options</li>
          <li>Users can submit new recipes when signed in</li>
        </ul>
      </div>
      <div>
        <NavLink className="icon" to="/messenger">
          <i className="fab fa-slack" /> Messenger
        </NavLink>
        <ul>
          <li>
            Implements the{' '}
            <a target="_blank" rel="noreferrer" href="https://api.slack.com">
              Slack API
            </a>{' '}
            and{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket"
            >
              Websocket API
            </a>
          </li>
          <li>Users can chat with me in real-time</li>
          <li>Displays my Slack online status</li>
        </ul>
      </div>
      <div>
        <NavLink className="icon" to="/meeting">
          <i className="fas fa-video" /> Meeting
        </NavLink>
        <ul>
          <li>
            Implements the{' '}
            <a target="_blank" rel="noreferrer" href="https://www.twilio.com/docs/usage/api">
              Twilio API
            </a>{' '}
            and{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API"
            >
              WebRTC API
            </a>
          </li>
          <li>Users can have a 1:1 meeting with video/audio</li>
          <li>Displays a sharable room link to invite others</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
