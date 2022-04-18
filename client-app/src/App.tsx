import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';


function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/activities").then((response: any) => setActivities(response.data));
  }, [])

  return (
    <div>
        <Header as='h2' icon="users" content="Reactivities"/>
        <img src={logo} className="App-logo" alt="logo" />
       
        <List>
          {activities.map((a: any) => <List.Item key={a.id}>{a.title}</List.Item>)}
        </List>
    </div>
  );
}

export default App;
