import React, { FC, useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

const PhotoUploadWidget: FC<Props> = ({loading, uploadPhoto}) => {

    const [files, setFiles] = useState([]);

    const [cropper, setCropper] = useState<Cropper>();

    const onCrop = () => {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob));
        }
    }


    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 1 - Add Photo" />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>

            <Grid.Column width={1} />

            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 2 - Resize Photo" />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>

            <Grid.Column width={1} />

            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 3 - Preview & Upload" />
                {files && files.length > 0 && (
                    <>
                        <div className="img-preview" style={{ height: "200px", overflow: "hidden" }} />
                        <Button.Group widths={2}>
                            <Button onClick={onCrop} positive icon="check" loading={loading} />
                            <Button onClick={() => setFiles([])} icon="close" disabled={loading}/>
                        </Button.Group>
                    </>
                )}
            </Grid.Column>
        </Grid>
    )
}

export default PhotoUploadWidget;