import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import parse from 'html-react-parser';



class TinyEditor extends Component {
    state = { content: "" }

    handleEditorChange = (content, editor) => {
        this.setState({ content });
    }

    confirmAction = () => {
        const { addProfileOverlap, title, player } = this.props;
        if (addProfileOverlap) {
            let profile = {
                name: title,
                text: this.state.content,
            }
            profile.player = player;
            addProfileOverlap(profile);
        }
    }

    render() {
        return (
            <div className="tinyEditor">
                <Editor
                    apiKey="aav2pu19wqfcwk3k0fcugetpvv0g2esxr65lrb8oas4r5okk"
                    value={this.state.content}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image',
                            'charmap print preview anchor help',
                            'searchreplace visualblocks code',
                            'insertdatetime media table paste wordcount'
                        ],
                        toolbar:
                            ` undo redo | forecolor  | bold italic underline | \
                            alignleft aligncenter alignright | indent `, 
                        // bbcode_dialect: 'punbb'
                    }}
                    onEditorChange={this.handleEditorChange}
                />
                <p>{parse(this.state.content)}</p>
                <button className="addProfile" onClick={this.confirmAction}>Zaakceptuj</button>
            </div>
        );
    }
}
const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(TinyEditor);