import { format } from "date-fns";
import { makeAutoObservable, reaction } from "mobx";
import { agent } from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Pagination, PagingParams } from "../models/pagination";
import { Profile } from "../models/profile";
import { store } from "./store";

export default class ActivityStore {
    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            })
    }

    activityRegistry = new Map<string, Activity>()
    private setRegisteredActivity = (value: Activity) => {
        const user = store.userStore.user;

        if (user) {
            value.isGoing = value.attendees!.some(a => a.username === user.username);
            value.isHost = value.hostUsername === user.username;
            value.host = value.attendees?.find(x => x.username === value.hostUsername);
        }
        value.date = new Date(value.date);
        this.activityRegistry.set(value.id, value);
    }
    private deleteRegisteredActivity = (id: string) => this.activityRegistry.delete(id);

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    }


    get grouppedActivities() {
        return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
            const date = format(activity.date, "dd MMM yyyy");
            activities[date] = activities[date] ? [...activities[date], activity] : [activity]
            return activities;
        }, {} as { [key: string]: Activity[] }))
    }

    selectedActivity: Activity | undefined = undefined;
    private setSelectedActivity = (value: Activity | undefined) => this.selectedActivity = value;

    loading = false;
    private setLoading = (value: boolean) => this.loading = value;

    loadingInitial = false;
    setLoadingInitial = (value: boolean) => this.loadingInitial = value;

    pagination: Pagination | null = null;
    setPagination = (value: Pagination) => this.pagination = value;

    pagingParams = new PagingParams();
    setPagingParams = (value: PagingParams) => this.pagingParams = value;

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("pageNumber", this.pagingParams.pageNumber.toString())
        params.append("pageSize", this.pagingParams.pageSize.toString())

        this.predicate.forEach((value, key) => {
            if(key === "startDate"){
                params.append(key, (value as Date).toISOString());
            }else{
                params.append(key, value);
            }
        })
        return params;
    }

    predicate = new Map().set("all", true);
    setPredicate = (predicate: string, value: string|Date) => {
        const resetPredicate = () => this.predicate.forEach((value, key) => key !== "startDate" && this.predicate.delete(key));

        switch(predicate){    
            case "all":
                resetPredicate();
                this.predicate.set("all", true);
                break;
            case "isGoing":
                resetPredicate();
                this.predicate.set("isGoing", true);
                break;
            case "isHost":
                resetPredicate();
                this.predicate.set("isHost", true);
                break;
            case "startDate":
                this.predicate.delete("startDate");
                this.predicate.set("startDate", value);
                break;
        }
    }

    loadActivities = async () => {
        this.setLoadingInitial(true)
        try {
            const result = await agent.Activities.list(this.axiosParams)

            result.data.forEach(a => {
                this.setRegisteredActivity(a);
            });
            this.setPagination(result.pagination);
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

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user.username;
            newActivity.attendees = [attendee];
            
            this.setRegisteredActivity(newActivity);
            this.setSelectedActivity(newActivity);
        } catch (error) {
            console.log(error)
        }
    }


    updateActivity = async (activity: ActivityFormValues) => {
        this.setLoading(true)

        try {
            await agent.Activities.update(activity);
            if(activity.id){
                let updatedActivity = {
                    ...this.activityRegistry.get(activity.id),
                    ...activity
                }
                this.setRegisteredActivity(updatedActivity);
                this.setSelectedActivity(updatedActivity);
            }
        } catch (error) {
            console.log(error)
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

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.setLoading(true);
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            if(this.selectedActivity?.isGoing){
                this.setSelectedActivity({
                    ...this.selectedActivity,
                    attendees: this.selectedActivity.attendees?.filter(a => a.username !== user.username),
                    isGoing: false
                });
            }else{
                const attendee = new Profile(user!);
                const attendees = [...this.selectedActivity.attendees, attendee];
                this.setSelectedActivity({
                    ...this.selectedActivity,
                    attendees: attendees,
                    isGoing: true
                });
            }
            this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity);
        } catch (error) {
            console.log(error)
        } finally {
            this.setLoading(false)
        }
    }


    cancelActivityToggle = async () => {
        this.setLoading(true);
            await agent.Activities.attend(this.selectedActivity.id);
            this.setSelectedActivity({
                ...this.selectedActivity,
                isCancelled: !this.selectedActivity.isCancelled
            })
            this.setRegisteredActivity(this.selectedActivity);
        try{

        }catch(error){
            console.log(error)
        }finally{
            this.setLoading(false)
        }
    }

    clearSelectedActivity = () => this.selectedActivity = undefined;

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if(attendee.username === username){
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }
}