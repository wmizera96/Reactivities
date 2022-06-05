import { format } from "date-fns/esm";
import { observer } from "mobx-react-lite"
import React, { FC, SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Grid, Header, Image, Tab, TabProps } from "semantic-ui-react";
import { UserActivity } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";




const panes = [
    {menuItem: "Future Events", pane: {key: "future"}},
    {menuItem: "Past Events", pane: {key: "past"}},
    {menuItem: "Hosting", pane: {key: "hosting"}}
]

const ProfileActivities: FC = () => {
    const { loadActivities, profile, loadingActivities, userActivities } = useStore().profileStore;

    useEffect(() => {
        loadActivities(profile.username, "future");
    }, [loadActivities, profile.username])

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {

        loadActivities(profile.username, panes[data.activeIndex as number].pane.key as any)
    }

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="calendar" content="Activities"/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab panes={panes}
                        menu={{secondary: true, pointing: true}}
                        onTabChange={(e, data) => handleTabChange(e, data)}/>
                        <br/>
                        <Card.Group itemsPerRow={4}>
                            {userActivities.map((a: UserActivity) => ( 
                                <Card as={Link} to={`/activities/${a.id}`} key={a.id}>
                                    <Image src={`/assets/categoryImages/${a.category}.jpg`} style={{minHeight: "100px", objectFit: "cover"}}/>
                                    <Card.Content>
                                        <Card.Header textAlign="center">{a.title}</Card.Header>
                                        <Card.Meta textAlign="center">
                                            <div>{format(new Date(a.date), "do LLL")}</div>
                                            <div>{format(new Date(a.date), "h:mm a")}</div>
                                        </Card.Meta>
                                    </Card.Content>
                                </Card>
                            ))}

                        </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}



export default observer(ProfileActivities);