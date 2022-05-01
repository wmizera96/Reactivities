import { useField } from "formik";
import React, { FC } from "react"
import { Form, Label } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    label?: string;
}

const MyTextInput: FC<Props> = (props) => {

    const [field, meta] = useField(props.name);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <input {...field} {...props} />
            {meta.touched && !!meta.error &&
                <Label basic color="red">{meta.error}</Label>
            }
        </Form.Field>
    )
}

export default MyTextInput;