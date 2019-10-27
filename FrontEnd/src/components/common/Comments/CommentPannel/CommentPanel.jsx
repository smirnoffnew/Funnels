
import React from 'react'
import "./CommentPanel.css";
import { UserIcon } from '../../UserIcon/UserIcon';
import { EditorState, RichUtils, convertToRaw, } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';



import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';


const emojiButton = () => (
    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" width="4mm" height="4.14mm" viewBox="0 0 16.96 16.96">
  <path className="cls-1" style={{ fill: "#768093" }} d="M296.48,412.89a8.48,8.48,0,1,1-6,2.48,8.45,8.45,0,0,1,6-2.48h0Zm5,3.49a7.06,7.06,0,1,0,2.07,5,7,7,0,0,0-2.07-5h0Zm-9.25,7.81a0.71,0.71,0,0,1,1-1,4.74,4.74,0,0,0,3.21,1.44,5.33,5.33,0,0,0,3.4-1.46,0.71,0.71,0,1,1,.91,1.08,6.68,6.68,0,0,1-4.31,1.8,6.1,6.1,0,0,1-4.17-1.82h0Zm1.55-6.09a1.07,1.07,0,1,1-1.08,1.07,1.08,1.08,0,0,1,1.08-1.07h0Zm5.41,0a1.07,1.07,0,1,1-1.08,1.07,1.08,1.08,0,0,1,1.08-1.07h0Z" transform="translate(-288 -412.89)"/>
</svg>
)

const emojiPlugin = createEmojiPlugin({ selectButtonContent:emojiButton()});
const { EmojiSelect } = emojiPlugin;



export const CommentPanel = ({ sendComment, userName, userAvatarUrl }) => {
    return (
        <div className="comment-panel">
            <UserIcon userName={userName} userAvatarUrl={userAvatarUrl} />

            <div className="text-input">
                <RichEditor sendComment={sendComment} />

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


    handleClickComment(editorState) {

        // function cleanMessage(content){
            // const contentMass = content.split('<p>')
            // console.log("AA",contentMass," ",contentMass[contentMass.length - 1] === true )
            // if(co ){
            //     console.log("that string hav")
            // }
        // }
       
        if (editorState) {
            // cleanMessage(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            console.log("draftToHtml(convertToRaw(editorState.getCurrentContent()))", draftToHtml(convertToRaw(editorState.getCurrentContent())))
            if (Boolean(editorState.getCurrentContent().getPlainText().trim()) !== false) {
                this.props.sendComment(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            }
            this.setState({ editorState: EditorState.createEmpty() })
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
                        keyBindingFn={this.onTab}
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
                            <EmojiSelect  selectButtonContent = {"sdf"}/>
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
    'STRIKETHROUGH': {
        textDecoration: 'line-through',
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



const unorderListItem = () => (
    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" width="4.54mm" height="3.25mm" viewBox="0 0 12.88 10.5">
  <path className="cls-1" style={{ fill: "#768093" }} d="M294.89,417.73a0.64,0.64,0,1,1,0-1.28h8.35a0.64,0.64,0,0,1,0,1.28h-8.35ZM291,424h2.33v2.37H291V424h0Zm0-4.06h2.33v2.37H291V420h0Zm0-4.07h2.33v2.37H291v-2.37h0Zm3.89,10a0.64,0.64,0,1,1,0-1.28h8.35a0.64,0.64,0,0,1,0,1.28h-8.35Zm0-4.06a0.64,0.64,0,1,1,0-1.28h8.35a0.64,0.64,0,0,1,0,1.28h-8.35Z" transform="translate(-291 -415.89)"/>
</svg>
)

const orderListItem = () => (
    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" width="4.14mm" height="3.25mm" viewBox="0 0 11.74 10.45">
  <path className="cls-1" style={{ fill: "#768093" }} d="M295.25,417.88a0.65,0.65,0,0,1,0-1.28h7a0.65,0.65,0,0,1,0,1.28h-7Zm-1.8,7.81v0.65H291a1.69,1.69,0,0,1,.24-0.7,4.67,4.67,0,0,1,.78-0.87,4.93,4.93,0,0,0,.58-0.6,0.77,0.77,0,0,0,.14-0.43,0.49,0.49,0,0,0-.13-0.36,0.53,0.53,0,0,0-.69,0,0.68,0.68,0,0,0-.15.44l-0.7-.07a1.14,1.14,0,0,1,.39-0.83,1.31,1.31,0,0,1,.82-0.25,1.18,1.18,0,0,1,.85.29,1,1,0,0,1,.31.72,1.27,1.27,0,0,1-.09.47,1.89,1.89,0,0,1-.28.47,4.36,4.36,0,0,1-.46.47c-0.22.2-.36,0.34-0.42,0.4a1.18,1.18,0,0,0-.14.19h1.39ZM293,419.55h-0.7v-2.63a2.39,2.39,0,0,1-.9.53v-0.64a2,2,0,0,0,.59-0.34,1.29,1.29,0,0,0,.44-0.58H293v3.66h0Zm2.22,6.45a0.65,0.65,0,0,1,0-1.28h7a0.65,0.65,0,0,1,0,1.28h-7Zm0-4.06a0.65,0.65,0,0,1,0-1.28h7a0.65,0.65,0,0,1,0,1.28h-7Z" transform="translate(-291 -415.89)"/>
</svg>
)


const BLOCK_TYPES = [
    { label: unorderListItem(), style: 'unordered-list-item' },
    { label: orderListItem(), style: 'ordered-list-item' },
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
            {BLOCK_TYPES.map((type, index) =>
                <StyleButton
                    key={index}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

const boldIcon = () => {
    return (
        <svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" width="3.11mm" height="3.12mm" viewBox="0 0 8.83 11.68">
            <path className="cls-1" style={{ fill: "#768093" }} d="M292,427.57V415.89h4.38a5.43,5.43,0,0,1,2.15.35,2.75,2.75,0,0,1,1.26,1.09,2.85,2.85,0,0,1,.46,1.54,2.66,2.66,0,0,1-.41,1.41,2.9,2.9,0,0,1-1.22,1.07,3,3,0,0,1,1.63,1.06,2.83,2.83,0,0,1,.57,1.77,3.42,3.42,0,0,1-.35,1.53,3,3,0,0,1-.86,1.09,3.62,3.62,0,0,1-1.28.58,7.77,7.77,0,0,1-1.89.2H292Zm1.55-6.77h2.53a5.66,5.66,0,0,0,1.47-.14,1.64,1.64,0,0,0,.89-0.58,1.69,1.69,0,0,0,.3-1,1.86,1.86,0,0,0-.28-1,1.41,1.41,0,0,0-.8-0.61,6.66,6.66,0,0,0-1.78-.16h-2.34v3.54h0Zm0,5.4h2.91a6.62,6.62,0,0,0,1.06-.06,2.5,2.5,0,0,0,.89-0.32,1.7,1.7,0,0,0,.59-0.65,2,2,0,0,0,.23-1,1.94,1.94,0,0,0-.34-1.14,1.76,1.76,0,0,0-.93-0.68,5.72,5.72,0,0,0-1.71-.2h-2.7v4h0Z" transform="translate(-292 -415.89)" />
        </svg>
    )
}

const italicIcon = () => (
    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" width="2.48mm" height="3.12mm" viewBox="0 0 7.02 11.68">
        <polygon className="cls-1" style={{ fill: "#768093" }} points="1.93 10.13 3.72 1.55 1.89 1.55 1.89 0 4.05 0 5.6 0 7.02 0 7.02 1.55 5.28 1.55 3.48 10.13 5.13 10.13 5.13 11.68 3.15 11.68 1.6 11.68 0 11.68 0 10.13 1.93 10.13 1.93 10.13" />
    </svg>
)

const underLineIcon = () => (
    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" width="3.5mm" height="3.13mm" viewBox="0 0 9.93 11.72">
  <path className="cls-1" style={{ fill: "#768093" }}  d="M299.51,415.89h1.31v5.68a6.78,6.78,0,0,1-.33,2.36,2.89,2.89,0,0,1-1.21,1.42,4.28,4.28,0,0,1-2.3.55,4.7,4.7,0,0,1-2.26-.48,2.71,2.71,0,0,1-1.25-1.38,6.6,6.6,0,0,1-.38-2.47v-5.68h1.31v5.68a5.55,5.55,0,0,0,.24,1.89,1.79,1.79,0,0,0,.82.94,2.81,2.81,0,0,0,1.41.33,2.7,2.7,0,0,0,2-.65,3.77,3.77,0,0,0,.61-2.51v-5.68h0ZM292,427h9.93v0.63H292V427h0Z" transform="translate(-292 -415.89)"/>
</svg>
)

const strikethroughIcon = () => (
    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" width="3.11mm" height="3.11mm" viewBox="0 0 12.09 12.24">
  <path className="cls-1" style={{ fill: "#768093" }} d="M291.71,421.1a0.71,0.71,0,1,1,0-1.42h1.07a4.44,4.44,0,0,1,1-3.43,4,4,0,0,1,1.78-1.17,4.18,4.18,0,0,1,2.14-.1,4.91,4.91,0,0,1,3.23,2.53,0.71,0.71,0,1,1-1.23.69,3.52,3.52,0,0,0-2.29-1.83,2.78,2.78,0,0,0-1.42.06,2.54,2.54,0,0,0-1.15.74,3.11,3.11,0,0,0-.64,2.5h8.18a0.71,0.71,0,1,1,0,1.42H291.71Zm7.87,1.21a0.71,0.71,0,1,1,1.4-.18,4.49,4.49,0,0,1-1,3.65,4,4,0,0,1-1.78,1.17,4.18,4.18,0,0,1-2.14.1,4.91,4.91,0,0,1-3.23-2.53,0.71,0.71,0,0,1,1.23-.69,3.52,3.52,0,0,0,2.29,1.83,2.78,2.78,0,0,0,1.42-.06,2.53,2.53,0,0,0,1.15-.74,3.12,3.12,0,0,0,.64-2.53h0Z" transform="translate(-291 -414.89)"/>
</svg>
)

var INLINE_STYLES = [
    { label: boldIcon(), style: 'BOLD' },
    { label: italicIcon(), style: 'ITALIC' },
    { label: underLineIcon(), style: 'UNDERLINE' },
    {label: strikethroughIcon(), style:  'STRIKETHROUGH'}

];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type, index) =>
                <StyleButton
                    key={index}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}

        </div>
    );
};