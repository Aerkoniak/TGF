import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, ContentState } from 'draft-js';
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'draft-js/dist/Draft.css';
import htmlToText from 'html-to-text';
import parse from 'html-react-parser';
import htmlToDraft from 'html-to-draftjs';




class RichEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
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
            })
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
   

    convtoRaw = (e) => {
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


        let messageObject = {};
        messageObject.text = markup;
        messageObject.player = this.props.player;
        messageObject.place = this.props.place;
        if (this.props.title && this.props.addreesse) {
            messageObject.title = this.props.title;
            messageObject.addreesse = this.props.addreesse
        }
        console.log(messageObject.text.length)
        console.log(messageObject.text)
        if (messageObject.text.length < 15) {
            return
        } else if (messageObject.text.length >= 15) {
            this.props.action(messageObject)
        }
       
    }


    render() {
        return (
            <div className="richEditorWrap">
                <form action="" className="richEditor" onSubmit={this.convtoRaw}>
                    <Editor
                        editorState={this.state.editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.myKeyBindingFn}
                        onChange={this.onChange}
                        customStyleMap={this.styleMap}
                    />
                    <div className="styleButtons">
                    <button className="fontButtons" onClick={this._onBoldClick.bind(this)}>Pogrubienie</button>
                    <button className="fontButtons" onClick={this._onItalicClick.bind(this)}>Kursywa</button>
                    <button className="fontButtons" onClick={this._onUnderlineClick.bind(this)}>Podkreślenie</button>
                    <button className="fontButtons" onClick={this._onLineThrough.bind(this)}>Przekreślenie</button>
                    <input className="answerSubmit" type="submit" value="Wyślij" onSubmit={this.convtoRaw} />
                </div>
                </form>
            </div>
        );
    }
}

export default RichEditor