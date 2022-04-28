import { observer } from "mobx-react-lite";
import { FC, Fragment } from "react";
import { Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";


const ActivityList: FC = () => {

    const { grouppedActivities } = useStore().activityStore;

    return (
        <>
            {grouppedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color="teal">
                        {group}
                    </Header>
                    {activities.map(activity => <ActivityListItem key={activity.id} activity={activity} />)}
                </Fragment>
            ))}
        </>
    )
}

export default observer(ActivityList);