import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, TinyMCE_1 } from '@tinymce/tinymce-react';
import parse from 'html-react-parser';



class TinyEditor extends Component {
    state = {
        content: "",
        dateValue: "",
        timeValue: "",
        warnings: "",

    }

    handleEditorChange = (content, editor) => {
        this.setState({ content });
    }

    confirmAction = () => {
        const { addProfileOverlap, title, player, sendMailReply, place, addChapterPrive, addChapterGlobal, createPriveStory, createStory, sendMail, editOverlap } = this.props;
        if (addProfileOverlap) {
            let profile = {
                name: title,
                text: this.state.content,
            }
            profile.player = player;
            addProfileOverlap(profile);
        } else if (sendMailReply) {
            let message = {};
            message.place = place;
            message.text = this.state.content;
            message.player = player;
            sendMailReply(message)
        } else if (addChapterPrive) {
            let chapter = {};
            chapter.place = place;
            chapter.player = player;
            chapter.text = this.state.content;
            addChapterPrive(chapter);
        } else if (addChapterGlobal) {
            let chapter = {};
            if (this.props.isAuthor) {
                chapter.nextTurn = `${this.state.dateValue}, ${this.state.timeValue}`
            };
            chapter.text = this.state.content;
            chapter.place = place;
            chapter.player = player;

            if (this.props.isAuthor) {
                if (!this.state.dateValue || !this.state.timeValue) {
                    this.setState({
                        warnings: "Musisz ustawić termin odpisu."
                    })
                } else addChapterGlobal(chapter)
            } else {
                addChapterGlobal(chapter)
            }

        } else if (createPriveStory) {
            let priveStory = {}
            priveStory.title = title;
            priveStory.players = this.props.playersInSession;
            priveStory.author = player;
            priveStory.text = this.state.content;

            createPriveStory(priveStory);
        } else if (createStory) {
            let story = {}
            let author = {
                name: player.name,
                id: player.id,
                rank: player.rank,
                docRef: player.accountDocRef
            };
            if (this.props.isAuthor) {
                story.nextTurn = `${this.state.dateValue}, ${this.state.timeValue}`
            };
            story.title = title;
            story.place = this.props.section;
            story.author = author;
            story.openMsg = this.state.content;
            if (this.props.isAuthor) {
                if (!this.state.dateValue || !this.state.timeValue) {
                    this.setState({
                        warnings: "Musisz ustawić termin odpisu."
                    })
                } else createStory(story);
            } else {
                createStory(story);
            }

        } else if (sendMail) {
            let message = {};
            message.player = player;
            message.title = title;
            message.addreesse = this.props.addreesse;
            message.text = this.state.content;
            sendMail(message);
        } else if (editOverlap) {
            let overlap = {};
            overlap.player = player;
            overlap.name = this.props.overlapName;
            overlap.text = this.state.content;
            editOverlap(overlap);
            this.props.closeEditor();
        }
    }



    render() {
        return (
            <div className="tinyEditor">
                {this.props.isAuthor ? <div className="nextTurn">
                    <label className="nextTurnLabel" htmlFor="">Ustaw termin końca tury: </label>
                    <input type="date" value={this.state.dateValue} onChange={(e) => this.setState({
                        dateValue: e.target.value,
                    })} />
                    <input type="time" value={this.state.timeValue} onChange={(e) => this.setState({
                        timeValue: e.target.value,
                    })} />
                    {this.state.dateValue && this.state.timeValue ? <span className="nextTurnSpan ok" >okej</span> : <span className="nextTurnSpan notOk">nie ustawiono</span>}
                </div> : null}
                <h2 className="test">{this.state.warnings}</h2>
                <Editor
                    apiKey="aav2pu19wqfcwk3k0fcugetpvv0g2esxr65lrb8oas4r5okk"
                    value={this.props.initialValue ? this.props.initialValue : this.state.content}
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
                            ` undo redo | forecolor formatselect | bold italic underline | \
                            alignleft aligncenter alignright | indent outdent wordcount`,
                        // bbcode_dialect: 'punbb'
                    }}
                    onEditorChange={this.handleEditorChange}
                />
                <button className="addProfile" onClick={this.confirmAction}>Zaakceptuj</button>
            </div>
        );
    }
}
const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(TinyEditor);