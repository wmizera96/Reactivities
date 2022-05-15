import React, { FC } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css"

interface Props {
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
}


const PhotoWidgetCropper: FC<Props> = ({ imagePreview, setCropper }) => {
    return (
        <Cropper
            src={imagePreview}
            style={{ height: "200px", width: "100%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={cropper => setCropper(cropper)}
        />
    )
}

export default PhotoWidgetCropper;