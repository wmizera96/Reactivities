import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { ActivityDetails } from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";


const ActivityDashboard: FC = () => {

    const { selectedActivity, editMode } = useStore().activityStore;

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                {selectedActivity && editMode === false &&
                    <ActivityDetails />}

                {editMode &&
                    <ActivityForm />}
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);