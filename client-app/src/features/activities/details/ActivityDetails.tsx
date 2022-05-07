import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";


const ActivityDetails: FC = () => {

    const { selectedActivity, loadActivity, loadingInitial } = useStore().activityStore;

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            loadActivity(id)
        }
    }, [id, loadActivity])

    if (loadingInitial || !selectedActivity)
        return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityDetailedHeader activity={selectedActivity} />
                <ActivityDetailedInfo activity={selectedActivity}/>
                <ActivityDetailedChat/>
            </Grid.Column>
            <Grid.Column width="6">
                <ActivityDetailedSidebar activity={selectedActivity}/>
            </Grid.Column>
        </Grid>
        )
}

export default observer(ActivityDetails);