import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import parse from 'html-react-parser';
import styles from '../../css/editor.module.css'

import { Button } from 'react-bootstrap';

import { createDate } from '../../data/usefullFN';



class TinyEditor extends Component {
    state = {
        content: "",
        dateValue: "",
        timeValue: "",
        warnings: "",
        hiddenContent: "",
        isHiddenAreaShown: false,
    }

    handleEditorChange = (content, editor) => {
        this.setState({ content });
    }

    confirmAction = () => {
        const { addProfileOverlap, title, player, sendMailReply, place, addChapterPrive, addChapterGlobal, createPriveStory, createStory, sendMail, editOverlap, addTavernRecord, updateDiary, editChapter } = this.props;

        const editChapterSupporter = (oldChapter) => {
            let chapter = { ...oldChapter };
            // console.log(chapter);
            let recordHistory = [];
            if (chapter.recordHistory) {
                recordHistory = [...chapter.recordHistory];
            }
            recordHistory.push(chapter.msg);
            chapter.recordHistory = recordHistory;
            // console.log(chapter);
            chapter.msg = this.state.content;
            chapter.lastEdit = {
                id: player.id,
                name: player.name,
                when: createDate()
            }
            // console.log(chapter);
            let recordIndex = false;

            let chapters = [...place.chapters];
            chapters.map((oneChapter, index) => {
                if (oneChapter.id === chapter.id) recordIndex = index
            });
            chapters.splice(recordIndex, 1, chapter);

            let editedChapter = {
                storyID: chapter.storyID,
                chapters: chapters
            }
            console.log(editedChapter);
            return editedChapter
        }

        if (addProfileOverlap) {
            let profile = {
                name: title,
                text: this.state.content,
            }
            profile.player = player;
            console.log(profile)
            addProfileOverlap(profile);
        } else if (sendMailReply) {
            let message = {};
            message.place = place;
            message.text = this.state.content;
            message.player = player;
            sendMailReply(message)
        } else if (addChapterPrive) {
            let chapter = {};

            if (this.props.initialValue) {
                const editedChapter = editChapterSupporter(this.props.recordBefore);
                // console.log(editedChapter)
                editChapter(editedChapter);
            } else {
                chapter.place = place;
                chapter.player = player;
                chapter.text = this.state.content;
                if (this.props.withHiddenContent) {
                    chapter.hiddenContent = this.state.hiddenContent;
                }
                addChapterPrive(chapter);
            }
            this.setState({
                content: ""
            })
        } else if (addChapterGlobal) {
            if (this.props.initialValue) {

                const editedChapter = editChapterSupporter(this.props.recordBefore);
                // console.log(editedChapter)
                editChapter(editedChapter);

            } else {
                let chapter = {};
                if (this.props.isAuthor) {
                    chapter.nextTurn = `${this.state.dateValue}, ${this.state.timeValue}`
                };
                chapter.text = this.state.content;
                chapter.place = place;
                chapter.player = player;
                if (this.props.withHiddenContent) {
                    chapter.hiddenContent = this.state.hiddenContent;
                }

                if (this.props.isAuthor) {
                    if (!this.state.dateValue || !this.state.timeValue) {
                        this.setState({
                            warnings: "Musisz ustawić termin odpisu."
                        })
                    } else addChapterGlobal(chapter)
                } else {
                    addChapterGlobal(chapter)
                }
            }


        } else if (createPriveStory) {

            let priveStory = {}
            priveStory.title = title;
            priveStory.players = this.props.playersInSession;
            priveStory.author = {
                name: player.name,
                id: player.id,
                accountDocRef: player.accountDocRef
            };
            priveStory.text = this.state.content;

            console.log(priveStory)
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
            if (this.props.newTitle) {
                overlap.name = this.props.newTitle;
                overlap.oldName = this.props.overlapName;
            }
            overlap.text = this.state.content;
            editOverlap(overlap);
            this.props.closeEditor();
        } else if (addTavernRecord) {
            let tavernRecord = {};
            tavernRecord.player = player;
            tavernRecord.place = place;
            tavernRecord.text = this.state.content;
            addTavernRecord(tavernRecord);
        } else if (updateDiary) {
            let diaryEntry = {}
            diaryEntry.player = player;
            diaryEntry.character = this.props.character;
            diaryEntry.text = this.state.content;
            updateDiary(diaryEntry)
        }
    }



    render() {
        return (
            <div className={styles.tinyEditor}>
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
                        // skin: 'oxide-dark',
                        // content_css: 'dark',
                        menubar: true,
                        plugins: [
                            'advlist autolink lists link image',
                            'charmap print preview anchor help',
                            'searchreplace visualblocks code',
                            'insertdatetime media table paste wordcount'
                        ],
                        toolbar:
                            ` undo redo | forecolor formatselect | bold italic underline | \
                            alignleft aligncenter alignright | indent outdent wordcount`,

                    }}
                    onEditorChange={this.handleEditorChange}
                />
                {this.props.withHiddenContent ? <>
                    {this.state.isHiddenAreaShown ? <textarea className={styles.hiddenMsg} value={this.state.hiddenContent} onChange={(e) => this.setState({ hiddenContent: e.target.value })} placeholder="Ten tekst zobaczy tylko MG" ></textarea> : null}
                    <Button size="sm" className="addProfile" variant="outline-success" onClick={() => this.setState({ isHiddenAreaShown: !this.state.isHiddenAreaShown })} >Dodaj OT</Button>
                </> : null}


                <Button size="lg" className="addProfile" variant="outline-danger" onClick={this.confirmAction}>Zaakceptuj</Button>
            </div>
        );
    }
}
const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(TinyEditor);