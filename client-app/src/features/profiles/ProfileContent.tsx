import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfileActivities from "./ProfileActivities";
import ProfileFollowings from "./ProfileFollowings";
import ProfilePhotos from "./ProfilePhotos";

interface Props {
    profile: Profile;
}

const ProfileContent: FC<Props> = ({ profile }) => {

    const {setActiveTab } = useStore().profileStore;

    const panes = [
        { menuItem: "About", render: () => <Tab.Pane>About Content</Tab.Pane> },
        { menuItem: "Photos", render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: "Events", render: () => <ProfileActivities/> },
        { menuItem: "Follwers", render: () => <ProfileFollowings /> },
        { menuItem: "Following", render: () => <ProfileFollowings /> }
    ]

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition="right"
            panes={panes}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
        />
    )
}

export default observer(ProfileContent);