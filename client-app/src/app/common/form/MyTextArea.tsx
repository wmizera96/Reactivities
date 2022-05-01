import { useField } from "formik";
import React, { FC } from "react"
import { Form, Label } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    rows: number;
    label?: string;
}

const MyTextArea: FC<Props> = (props) => {

    const [field, meta] = useField(props.name);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <textarea {...field} {...props} />
            {meta.touched && !!meta.error &&
                <Label basic color="red">{meta.error}</Label>
            }
        </Form.Field>
    )
}

export default MyTextArea;