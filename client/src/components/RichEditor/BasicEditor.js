import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import parse from 'html-react-parser';
import styles from '../../css/editor.module.css'

import { Button } from 'react-bootstrap';

class BasicEditor extends Component {
    state = { content: "", }

    handleEditorChange = (content, editor) => {
        this.setState({ content });
    }

    confirmAction = () => {
        const { player, tavern, room, inTavern } = this.props;

        if (inTavern) {
            let record = {};
            let author = {
                name: player.name,
                id: player.id
            }
            record.tavern = tavern;
            record.room = room;
            record.text = this.state.content;
            record.author = author;
            inTavern(record);
        }
    }

    render() {
        return (
            <div className={styles.tinyEditor}>
                <Editor apiKey="aav2pu19wqfcwk3k0fcugetpvv0g2esxr65lrb8oas4r5okk"
                    init={{
                        height: 300,
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
                <Button className="addProfile" variant="outline-danger" onClick={this.confirmAction} >Wyślij</Button>
            </div>
        );
    }
}

export default BasicEditor;