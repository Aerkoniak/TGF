import React, { useCallback, useState } from 'react'
import { connect, useSelector } from 'react-redux';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'
import request from 'superagent';

const DropZone = ({ player }) => {

    const [warnings, setWarnings] = useState("");

    const onDrop = useCallback(acceptedFiles => {
        let type = (acceptedFiles[0].type);
        let size = acceptedFiles[0].size
        console.log(size)
        if (size > 100000) {
            setWarnings("Plik nie może być większy niż 100kb")
        } else {
            const fileType = type.split('/');
            console.log(fileType)
            const file = new FormData();
            file.append(`avatar`, acceptedFiles[0], `${player.accountDocRef}.${fileType[1]}`);
            axios.post('/set-avatar', file, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
                .then(res => {
                    if (res.data.saved) {
                        setWarnings("Avatar załadowany")
                    }
                })
        }




    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {warnings ? <p className="test" style={{ color: "red" }} >{warnings}</p> : null}
            <label htmlFor="">Tutaj możesz dodać avatar:</label>
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p className="dropZone">Przeciągnij tutaj plik lub kliknij by wybrać ręcznie</p>
            }
        </div>
    )
}
const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(DropZone);