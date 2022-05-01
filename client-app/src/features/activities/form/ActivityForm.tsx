import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { FC } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/form/options/categoryOptions";
import MyDateInput from "../../../app/common/MyDateInput";
import { Activity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

const ActivityForm: FC = () => {

    const { loadActivity, loading, createActivity, updateActivity, loadingInitial, setLoadingInitial } = useStore().activityStore;

    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [activity, setActivity] = useState<Activity>({
        id: "",
        title: "",
        category: "",
        description: "",
        date: null,
        city: "",
        venue: ""
    });


    const validationSchema = Yup.object({
        title: Yup.string().required("The activity title is required"),
        description: Yup.string().required("The activity description is required"),
        category: Yup.string().required(),
        date: Yup.string().nullable().required("Date is required"),
        venue: Yup.string().required(),
        city: Yup.string().required()
    })

    useEffect(() => {
        if (id) {
            loadActivity(id).then(a => setActivity(a));
        } else {
            setLoadingInitial(false)
        }
    }, [id, loadActivity, setLoadingInitial])


    if (loadingInitial)
        return <LoadingComponent content="Loading..." />

    const handleFormSubmit = async (activity: Activity) => {

        if (!activity.id) {
            const newActivity = {
                ...activity,
                id: uuid()
            }
            await createActivity(newActivity);
            history.push(`/activities/${newActivity.id}`)
        }
        else{
            await updateActivity(activity);
            history.push(`/activities/${activity.id}`)
        }

    }


    return (
        <Segment clearing>
            <Header content="Activity Details" sub color="teal"/>
            <Formik enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)} validationSchema={validationSchema}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInput name="title" placeholder="Title" />
                        <MyTextArea placeholder="Description" name="description" rows={3} />
                        <MySelectInput options={categoryOptions} placeholder="Category" name="category" />
                        <MyDateInput placeholderText="Date" name="date" showTimeSelect timeCaption="time" dateFormat="MMMM d, yyyy h:mm aa" />
                        <Header content="Location Details" sub color="teal"/>
                        <MyTextInput placeholder="City" name="city" />
                        <MyTextInput placeholder="Venue" name="venue" />
                        <Button disabled={isSubmitting || !dirty || !isValid} loading={loading} floated="right" positive type="submit" content="Submit" />
                        <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
}

export default observer(ActivityForm);