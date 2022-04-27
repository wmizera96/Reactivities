import React, { FC } from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
    inverted?: boolean;
    content?: string;
}

export const LoadingComponent: FC<Props> = ({ inverted = true, content = "Loading..." }) => {
    return (
        <Dimmer active inverted={inverted}>
            <Loader content={content} />
        </Dimmer>
    )
}