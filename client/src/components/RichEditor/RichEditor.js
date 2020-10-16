import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, ContentState } from 'draft-js';
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'draft-js/dist/Draft.css';
import htmlToText from 'html-to-text';
import parse from 'html-react-parser';
import htmlToDraft from 'html-to-draftjs';
import Datetime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/pl'
import "react-datetime/css/react-datetime.css";

import { connect } from 'react-redux';
// import NextTurnDate from '../NextTurnDate/NextTurnDate';




class RichEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            isAuthor: false,
            dateValue: "",
            timeValue: "",
        };
        this.onChange = editorState => this.setState({ editorState });
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    componentDidMount() {
        if (this.props.oldProfile) {
            let blocksFromHtml = htmlToDraft(this.props.oldProfile);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            this.setState({
                editorState: EditorState.createWithContent(contentState)
            });
        }
    }

    myKeyBindingFn(e) {
        if (e.keyCode === 13) {
            return 'put_br'
        }
        return getDefaultKeyBinding(e);
    }

    handleKeyCommand(command, editorState) {
        if (command === "put_br") {
            this.onChange(RichUtils.insertSoftNewline(this.state.editorState));
            return 'handled';
        }

        return 'not-handled';
    }

    styleMap = {
        'STRIKETHROUGH': {
            textDecoration: 'line-through',
        },
    }

    _onBoldClick(e) {
        e.preventDefault()
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }
    _onItalicClick(e) {
        e.preventDefault()
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    }
    _onUnderlineClick(e) {
        e.preventDefault()
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }
    _onLineThrough(e) {
        e.preventDefault()
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH'));
    }


    submitRichEditor = (e) => {
        // e.preventDefault();
        const rawContentState = convertToRaw(this.state.editorState.getCurrentContent());
        const hashConfig = {
            trigger: '#',
            separator: ' ',
        }
        const markup = draftToHtml(
            rawContentState,
            hashConfig,
        );

        if (this.props.storyCreator) {
            let story = this.props.storyCreator.newStory
            story.openMsg = markup;
        }
        
        let messageObject = {};
        messageObject.text = markup;
        messageObject.player = this.props.player;
        messageObject.place = this.props.place;

        if (this.props.title && this.props.addreesse) {
            messageObject.title = this.props.title;
            messageObject.addreesse = this.props.addreesse
        }
        if (this.props.priveStoryCreator) {
            // usuwam zbędne messageObjecty, a potem dodaje tytuł przekazany w propsie.
            delete messageObject.place;
            delete messageObject.player;
            messageObject.title = this.props.title;
            messageObject.players = this.props.playersInSession;
            messageObject.author = this.props.player;
        }
        if (this.props.isAuthor) {
            messageObject.nextTurn = `${this.state.dateValue}, ${this.state.timeValue}`
        }

        if (messageObject.text.length < 15) {
            return
        } else if (messageObject.text.length >= 15) {
            this.props.action(messageObject);
            this.setState({
                editorState: EditorState.createEmpty(),
            })
        }

    }

    // isDateValid = (current) => {
    //     return current.isAfter( this.state.yesterday );
    // }
    // _onInputChange = e => {
    // 	if ( !this.callHandler( this.props.inputProps.onChange, e ) ) return;

    // 	const value = e.target ? e.target.value : e;
    // 	const localMoment = this.localMoment( value, this.getFormat('datetime') );
    // 	let update = { inputValue: value };

    // 	if ( localMoment.isValid() ) {
    // 		update.selectedDate = localMoment;
    // 		update.viewDate = localMoment.clone().startOf('month');
    // 	}
    // 	else {
    // 		update.selectedDate = null;
    // 	}

    // 	this.setState( update, () => {
    // 		this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue );
    // 	});
    // }

    render() {
        return (
            <div className="richEditorWrap">
                {this.props.isAuthor ? <div className="nextTurn">
                    <label className="nextTurnLabel" htmlFor="">Ustaw termin końca tury: </label>
                    <input type="date" value={this.state.dateValue} onChange={(e) => this.setState({
                        dateValue: e.target.value,
                    })} />
                    <input type="time" value={this.state.timeValue} onChange={(e) => this.setState({
                        timeValue: e.target.value,
                    })} />
                    {this.state.dateValue && this.state.timeValue ? <span className="nextTurnSpan ok" >okej</span> : <span className="nextTurnSpan notOk">nie ustawiono</span> }
                </div> : null}
                <form action="" className="richEditor" onSubmit={this.submitRichEditor}>
                    <Editor
                        editorState={this.state.editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.myKeyBindingFn}
                        onChange={this.onChange}
                        customStyleMap={this.styleMap}
                        placeholder={this.props.placeholder ? this.props.placeholder : null}
                    />
                    <div className="styleButtons">
                        <button className="fontButtons" onClick={this._onBoldClick.bind(this)}>Pogrubienie</button>
                        <button className="fontButtons" onClick={this._onItalicClick.bind(this)}>Kursywa</button>
                        <button className="fontButtons" onClick={this._onUnderlineClick.bind(this)}>Podkreślenie</button>
                        <button className="fontButtons" onClick={this._onLineThrough.bind(this)}>Przekreślenie</button>
                        <input className="answerSubmit" type="submit" value="Wyślij" onSubmit={this.submitRichEditor} />
                    </div>
                </form>
            </div>
        );
    }
}

const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(RichEditor)