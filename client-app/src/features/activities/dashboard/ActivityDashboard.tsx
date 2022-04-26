import React, { FC } from "react";
import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { ActivityList } from "./ActivityList";

interface Props {
    activities: Activity[]
}


export const ActivityDashboard: FC<Props> = ({ activities }) => {
    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList activities={activities}/>
            </Grid.Column>
        </Grid>
    )
}