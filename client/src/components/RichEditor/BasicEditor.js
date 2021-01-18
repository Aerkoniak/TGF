import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import parse from 'html-react-parser';
import styles from '../../css/editor.module.css';
import { editRecord } from '../../data/slices/tavernSlice';

import { Button, InputGroup, FormControl } from 'react-bootstrap';

class BasicEditor extends Component {
    state = {
        content: "",
        isThisWhisper: false,
        whisperedAdres: false,
        whisperedID: "",
        whisperedName: ""
    }


    pickPlayer = (id) => {
        console.log(typeof id);
        let adress = {};
        this.props.characters.forEach(char => {
            if (char.id === Number(id)) {
                adress.name = char.name;
                adress.id = char.id
            }
        })
        // console.log(adress)
        this.setState({
            whisperedID: id,
            whisperedAdres: adress,
            whisperedName: adress.name
        })
    }

    handleEditorChange = (content, editor) => {
        this.setState({ content });

    }

    confirmAction = () => {
        const { player, tavern, room, addTavernRecord } = this.props;

        if (addTavernRecord) {
            if (this.props.recordForEdit) {
                const { docName, edited, editedInd, roomName, records } = this.props.recordForEdit;
                let record = {
                    author: edited.author,
                    replyDate: edited.replyDate,
                    ID: edited.ID,
                    txt: this.state.content,
                };
                let recordsArray = [
                    ...records
                ];
                recordsArray.splice(editedInd, 1, record);

                let edit = {
                    docName: docName,
                    roomName: roomName,
                    type: "editRecord",
                    records: recordsArray,
                }
                edit[roomName] = recordsArray;
                console.log("Edytowano wiadomość.")
                this.props.editRecord(edit);
                this.setState({
                    content: ""
                })

            } else {
                let record = {};
                let author = {
                    name: player.name,
                    id: player.id
                }
                record.tavern = tavern;
                record.room = room;
                record.text = this.state.content;
                record.author = author;
                // console.log(this.state.isThisWhisper)
                if (this.state.isThisWhisper) {
                    record.whispered = true;
                    record.between = [
                        author,
                        this.state.whisperedAdres
                    ]
                }
                // console.log(record)
                addTavernRecord(record);
                this.setState({
                    content: "",
                    isThisWhisper: false,
                    whisperedAdres: false,
                    whisperedID: "",
                    whisperedName: ""
                })
            }


        }
    }

    render() {


        return (
            <div className={styles.tinyEditor}>
                {!this.props.recordForEdit ? <div>
                    <label className={styles.whisper} htmlFor="whisper">Czy chcesz zaszeptać?</label>
                    <input className={styles.whisper} type="checkbox" value={this.state.isThisWhisper} onChange={(e) => this.setState({ isThisWhisper: !this.state.isThisWhisper })} />
                </div> : null}


                {this.state.isThisWhisper || this.props.Whisper ?
                    <div className={styles.formControl}>
                        <input type="number" value={this.props.Whisper ? this.props.Whisper : this.state.whisperedID} onChange={(e) => this.pickPlayer(e.target.value)} placeholder="Podaj ID osoby, do której szepczesz." />
                        <input type="text" disabled value={`Szepczesz do ${this.state.whisperedName}`} />
                    </div>
                    : null}


                <Editor style={{ margin: "0" }} className={styles.editorItself} apiKey="aav2pu19wqfcwk3k0fcugetpvv0g2esxr65lrb8oas4r5okk"
                    value={this.props.recordForEdit ? this.props.recordForEdit.edited.txt : this.state.content}
                    init={{
                        height: 300,
                        // content_css: "css/editor.module.css",
                        selector: 'textarea',
                        body_class: 'tavernEditor tinyReact',
                        menubar: false,
                        plugins: [
                            'wordcount'
                        ],
                        toolbar:
                            ` undo redo | forecolor | bold italic underline | \
                            alignleft aligncenter alignright | wordcount`,
                    }}
                    onEditorChange={this.handleEditorChange}
                />
                <Button className="addProfile" variant="outline-danger" onClick={this.confirmAction} >{this.state.isThisWhisper || this.props.Whisper ? "Zaszepcz" : "Wyślij wiadomość"}</Button>
            </div>
        );
    }
}

const MapDispatchToProps = dispatch => ({
    editRecord: (edit) => dispatch(editRecord(edit))
})

const MapStateToProps = state => ({
    characters: state.characters.characters
})

export default connect(MapStateToProps, MapDispatchToProps)(BasicEditor);