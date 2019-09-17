
import React from 'react'
import "./CommentPanel.css";
import { UserIcon } from '../../UserIcon/UserIcon';
import { EditorState, RichUtils, convertToRaw,  } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';



import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';

const emojiPlugin = createEmojiPlugin();
const { EmojiSelect } = emojiPlugin;



export const CommentPanel = ({ sendComment, userName, userAvatarUrl }) => {
    return (
        <div className="comment-panel">
            <UserIcon userName={userName} userAvatarUrl={userAvatarUrl} />

            <div className="text-input">
                <RichEditor sendComment={sendComment}/>

            </div>
        </div>
    )
}
class RichEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };

        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => { this.setState({ editorState }) };

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }

    _handleKeyCommand(command) {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    
    handleClickComment(editorState){
        if (editorState) { 
            if(Boolean(editorState.getCurrentContent().getPlainText().trim())!== false){
                this.props.sendComment(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            } 
            this.setState( { editorState: EditorState.createEmpty() })
        } 
    }


    render() {
        const { editorState } = this.state;
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div className="RichEditor-root">


                <div className={className} onClick={this.focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        ref="editor"
                        spellCheck={true}
                        plugins={[emojiPlugin]}

                    />
                </div>
                <div className={'RichEditor-block-utils'}>
                    <div className={'RichEditor-utils-text'}>
                        <InlineStyleControls
                        editorState={editorState}
                    sendComment={this.props.sendComment}
                    onToggle={this.toggleInlineStyle}
                    />
                        <BlockStyleControls
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <div className={'RichEditor-emoji-button'}>
                        <EmojiSelect />
                    </div>
                </div>
                <button
                    className="btn btn-1"
                    onClick={() => this.handleClickComment(editorState)}
                    style={{
                        height: 30,
                        width: 100,
                        margin: "5px 5px 5px auto",
                        borderRadius: "6px",
                        alignSelf: "flex-end"
                    }}
                >
                    Comment
              </button>

            </div>
            </div >
        );
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: '#fff',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    { label: '⋮', style: 'unordered-list-item' },
    { label: '☰', style: 'ordered-list-item' },
];

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};



var INLINE_STYLES = [
    { label: 'B', style: 'BOLD' },
    { label: 'I', style: 'ITALIC' },
    { label: 'U', style: 'UNDERLINE' },

];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}

        </div>
    );
};