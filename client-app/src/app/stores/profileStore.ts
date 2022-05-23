import { makeAutoObservable, reaction, runInAction } from "mobx";
import { agent } from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    setProfile = (profile: Profile | null) => {
        this.profile = profile;
    }

    loadingProfile = false;
    setLoadingProfile = (value: boolean) => {
        this.loadingProfile = value;
    }

    uploading = false;
    setUploading = (value: boolean) => {
        this.uploading = value;
    }

    loading = false;
    setLoading = (value: boolean) => {
        this.loading = value;
    }

    loadingFollowings = false;
    setLoadingFollowings = (value: boolean) => {
        this.loading = value;
    }

    followings: Profile[] = [];

    activeTab = 0;
    setActiveTab = (activeTab: any) => this.activeTab = activeTab;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? "followers" : "following";
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.setLoadingProfile(true);

        try {
            const profile = await agent.Profiles.get(username);
            this.setProfile(profile);

        } catch (error) {
            console.log(error)
        } finally {
            this.setLoadingProfile(false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.setUploading(true);
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            if (this.profile) {
                runInAction(() => {
                    this.profile.photos.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                })
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.setUploading(false)
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.setLoading(true);

        try {

            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);

            if (this.profile && this.profile.photos) {
                runInAction(() => {
                    this.profile.photos.find(x => x.isMain)!.isMain = false;
                    this.profile.photos.find(x => x.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                })
            }

        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false)
        }
    }


    deletePhoto = async (photo: Photo) => {
        this.setLoading(true);

        try {
            await agent.Profiles.deletePhoto(photo.id);

            if (this.profile && this.profile.photos) {
                runInAction(() => {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
                })
            }

        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false)
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.setLoading(true);
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);

            runInAction(() => {

                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followersCount++ :
                        this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }

                if(this.profile && this.profile.username === store.userStore.user?.username){
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }

                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                });
            })

        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }


    loadFollowings = async (predicate: string) => {
        this.setLoadingFollowings(true)

        try {
            const followings = await agent.Profiles.listFollowings(this.profile.username, predicate);

            runInAction(() => {
                this.followings = followings;
            })
        } catch (error) {

        } finally {
            this.setLoadingFollowings(false);
        }
    }
}