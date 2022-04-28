import { makeAutoObservable } from "mobx";
import { agent } from "../api/agent";
import { Activity } from "../models/activity";

export class ActivityStore {
    constructor() {
        makeAutoObservable(this);
    }

    activityRegistry = new Map<string, Activity>()
    private setRegisteredActivity = (value: Activity) => {
        value.date = value.date.split("T")[0]
        this.activityRegistry.set(value.id, value);
    }
    private deleteRegisteredActivity = (id: string) => this.activityRegistry.delete(id);

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    selectedActivity: Activity | undefined = undefined;
    private setSelectedActivity = (value: Activity | undefined) => this.selectedActivity = value;

    editMode = false;
    private setEditMode = (value: boolean) => this.editMode = value;

    loading = false;
    private setLoading = (value: boolean) => this.loading = value;

    loadingInitial = true;
    setLoadingInitial = (value: boolean) => this.loadingInitial = value;

    loadActivities = async () => {
        this.setLoadingInitial(true)
        try {
            const values = await agent.Activities.list()

            values.forEach(a => {
                this.setRegisteredActivity(a);
            });
            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.activityRegistry.get(id);

        if (activity) {
            this.setSelectedActivity(activity);
        } else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setRegisteredActivity(activity)
                this.setSelectedActivity(activity);
                this.setLoadingInitial(false);
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false);
            }
        }
        
        return activity;
    }

    createActivity = async (activity: Activity) => {
        this.setLoading(true);

        try {
            await agent.Activities.create(activity);
            this.setRegisteredActivity(activity);
            this.setSelectedActivity(activity);
            this.setEditMode(false);
            this.setLoading(false);
        } catch (error) {
            console.log(error)
            this.setLoading(false);
        }
    }


    updateActivity = async (activity: Activity) => {
        this.setLoading(true);

        try {
            await agent.Activities.update(activity);
            this.setRegisteredActivity(activity);
            this.setSelectedActivity(activity);
            this.setEditMode(false);
            this.setLoading(false);
        } catch (error) {
            console.log(error)
            this.setLoading(false);
        }
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);

        try {
            await agent.Activities.delete(id);
            this.deleteRegisteredActivity(id);
            this.setLoading(false);
        } catch (error) {
            console.log(error)
            this.setLoading(false);
        }
    }
}