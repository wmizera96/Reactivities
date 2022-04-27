import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import { NavBar } from './NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from "uuid";
import { agent } from '../api/agent';
import { LoadingComponent } from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
      const activities = response.map(a => ({
        ...a,
        date: a.date.split("T")[0]
      }));
      setActivities(activities);
      setLoading(false);
    })
  }, [])

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  const handleCancelSelectActivity = () => setSelectedActivity(undefined);


  const handleFormOpen = (id?: string) => {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  const handleFormClose = () => setEditMode(false);

  const handleCreateOrEditActivity = async (activity: Activity) => {
    setSubmitting(true);

    if(activity.id){
      await agent.Activities.update(activity);
      setActivities([...activities.filter(x => x.id !== activity.id),
        activity
      ])
      setEditMode(false);
      setSelectedActivity(activity);
      setSubmitting(false);
    }else{
      activity.id = uuid();
      await agent.Activities.create(activity);
      setActivities([...activities, activity]);
      setEditMode(false);
      setSelectedActivity(activity);
      setSubmitting(false);
    }
  }


  const handleDeleteActivity = async (id: string) => {
    setSubmitting(true);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(x => x.id !== id)])
    setSubmitting(false);
  }

  if (loading)
    return <LoadingComponent content='Loading app' />

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
