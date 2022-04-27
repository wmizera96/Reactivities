import React, { FC } from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";


export const ActivityDetails: FC = () => {

    const { selectedActivity, openForm, cancelSelectActivity } = useStore().activityStore;

    if(!selectedActivity)
        return <LoadingComponent />;

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{selectedActivity.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedActivity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedActivity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths="2">
                    <Button onClick={() => openForm(selectedActivity.id)} basic color="blue" content="Edit" />
                    <Button onClick={cancelSelectActivity} basic color="grey" content="Cancel" />
                </Button.Group>
            </Card.Content>
        </Card>)
}