import { makeAutoObservable } from "mobx";
import { agent } from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from "uuid";

export class ActivityStore {
    constructor() {
        makeAutoObservable(this);
    }

    activityRegistry = new Map<string, Activity>()
    private setRegisteredActivity = (value: Activity) => this.activityRegistry.set(value.id, value);
    private deleteRegisteredActivity = (id: string) => this.activityRegistry.delete(id);

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    selectedActivity: Activity | undefined = undefined;
    private setSelectedActivity = (value: Activity|undefined) => this.selectedActivity = value;
    
    editMode = false;
    private setEditMode = (value: boolean) => this.editMode = value;
    
    loading = false;
    private setLoading = (value: boolean) => this.loading = value;
    
    loadingInitial = true;
    private setLoadingInitial = (value: boolean) => this.loadingInitial = value;

    loadActivities = async () => {
        try {
            const values = await agent.Activities.list()

            values.forEach(a => {
                a.date = a.date.split("T")[0]
                this.setRegisteredActivity(a);
            });
            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }


    selectActivity = (id: string) => this.setSelectedActivity(this.activityRegistry.get(id));

    cancelSelectActivity = () => this.setSelectedActivity(undefined);

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.setEditMode(true);
    }

    closeForm = () => this.setEditMode(false);

    createActivity = async (activity: Activity) => {
        this.setLoading(true);
        activity.id = uuid()

        try{
            await agent.Activities.create(activity);
            this.setRegisteredActivity(activity);
            this.setSelectedActivity(activity);
            this.setEditMode(false);
            this.setLoading(false);
        }catch(error){
            console.log(error)
            this.setLoading(false);
        }
    }


    updateActivity = async (activity: Activity) => {
        this.setLoading(true);

        try{
            await agent.Activities.update(activity);
            this.setRegisteredActivity(activity);
            this.setSelectedActivity(activity);
            this.setEditMode(false);
            this.setLoading(false);
        }catch(error){
            console.log(error)
            this.setLoading(false);
        }
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);

        try{
            await agent.Activities.delete(id);
            this.deleteRegisteredActivity(id);
            if(this.selectedActivity?.id === id){
                this.cancelSelectActivity();
            }
            this.setLoading(false);
        }catch(error){
            console.log(error)
            this.setLoading(false);
        }
    }
}