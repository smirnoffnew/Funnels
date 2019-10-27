import React from "react";
import randomString from "random-string";
import ModalNodeWidget from "../../../../common/ModalNodeWidget";
import "./NotesNodeRightPanel.css";

export default class NotesNodeRightPanel extends React.Component {
  state = {
    note: "",
    showEdit: false
  };

  handleChangeNote = e =>
    this.setState({
      note: e.target.value
    });

  saveDiagramThenCloseSettingModal = file =>
    this.setState(
      {
        snackMsg: "next",
        showEdit: false,
        converted: this.props.app.serialization(
          this.props.work.showNotesWidgetEngine
        ),
        funnelName: this.props.work.diagram.funnelName,
        funnelNotes: this.props.work.diagram.funnelNotes,
      },
      () => {
        this.props.work.saveDiagramThenShowOrHideNotesModal(
          this.props.work.funnelId,
          this.state,
          file,
          false
        );
      }
    );

  delete = index => {
    this.props.work.showNotesWidgetModel.extras.notesd.splice(index, 1);
    document.getElementById("diagram-layer").click();
  };

  edit = (index, notebook) => {
    this.setState(
      prevState => {
        if (prevState.index !== index && prevState.index !== undefined) {
          this[`textareaRef${prevState.index}`].style.backgroundColor =
            "#ffefc1";
        }
        return {
          note: notebook[index],
          showEdit: true,
          index: index
        };
      },
      () =>
        (this[`textareaRef${this.state.index}`].style.backgroundColor =
          "#d8c2c2")
    );
  };

  changeNoteInNotebook = () => {
    this.setState(
      {
        notebook:
          (this.props.work.showNotesWidgetModel &&
            this.props.work.showNotesWidgetModel.extras.notesd) ||
          []
      },
      () => {
        if (this.state.note.length > 0) {
          let notebook = this.state.notebook;
          notebook[this.state.index] = this.state.note;

          (this.props.work.showNotesWidgetModel.extras.setNotesExtras &&
            this.props.work.showNotesWidgetModel.extras.setNotesExtras(
              notebook
            )) ||
            (this.props.work.showNotesWidgetModel.setNotes &&
              this.props.work.showNotesWidgetModel.setNotes(notebook));

          this.setState({ note: "", showEdit: false });
        }
      }
    );
    this[`textareaRef${this.state.index}`].style.backgroundColor = "#ffefc1";
  };

  cancel = () =>
    this.setState(
      { note: "", showEdit: false },
      () =>
        (this[`textareaRef${this.state.index}`].style.backgroundColor =
          "#ffefc1")
    );

  addNoteToNotebook = () => {
    this.setState(
      {
        notebook:
          (this.props.work.showNotesWidgetModel &&
            this.props.work.showNotesWidgetModel.extras.notesd) ||
          []
      },
      () => {
        if (this.state.note.length > 0) {
          let notebook = this.state.notebook;
          notebook.push(this.state.note);

          (this.props.work.showNotesWidgetModel.extras.setNotesExtras &&
            this.props.work.showNotesWidgetModel.extras.setNotesExtras(
              notebook
            )) ||
            (this.props.work.showNotesWidgetModel.setNotes &&
              this.props.work.showNotesWidgetModel.setNotes(notebook));

          this.setState({ note: "" });
        }
      }
    );
  };

  render() {
    
    return (
      <ModalNodeWidget
        show={this.props.work.showNotesWidgetBoolean}
        handleClose={() => {
          const name = randomString({ length: 10 });
          const file = new File(["test"], name, {
            type: "image/png"
          });
          this.saveDiagramThenCloseSettingModal(file);
        }}
      >
        <label className="label-create-widget-settings">Notes</label>
        <div className="modal-content-wrapper">
          <label htmlFor="note" className="label-input">
            Note
          </label>

          <textarea
            className="node-panel-textarea-input"
            id="note"
            placeholder="Start typing your note.."
            type="text"
            value={this.state.note}
            onChange={this.handleChangeNote}
          />

          {this.state.showEdit ? (
            <div style={{ display: "flex" }}>
              <button
                className="btn btn-1"
                onClick={() => this.changeNoteInNotebook()}
                style={{
                  height: 30,
                  width: 120,
                  margin: "10px auto"
                }}
              >
                Edit Note
              </button>

              <button
                className="btn btn-1"
                onClick={() => this.cancel()}
                style={{
                  height: 30,
                  width: 120,
                  margin: "10px auto"
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-1"
              onClick={() => this.addNoteToNotebook()}
              style={{
                height: 30,
                width: 120,
                margin: "10px auto"
              }}
            >
              Add Note
            </button>
          )}

          <div
            style={{
              height: 600,
              overflow: "auto"
            }}
          >
            {this.props.work.showNotesWidgetModel &&
              this.props.work.showNotesWidgetModel.extras &&
              this.props.work.showNotesWidgetModel.extras.notesd &&
              this.props.work.showNotesWidgetModel.extras.notesd.map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      margin: 5
                    }}
                  >
                    <textarea
                      className="node-panel-textarea-holder"
                      placeholder="Start typing your note.."
                      type="text"
                      value={item}
                      onChange={() => {}}
                      disabled
                      ref={ref => (this[`textareaRef${index}`] = ref)}
                    />
                    <button
                      onClick={() => this.delete(index)}
                      className="node-panel-delete-note"
                      title={"Delete Note"}
                    >
                      x
                    </button>

                    <button
                      onClick={() =>
                        this.edit(
                          index,
                          this.props.work.showNotesWidgetModel &&
                            this.props.work.showNotesWidgetModel.extras.notesd
                        )
                      }
                      className="node-panel-edit-note"
                      title={"Edit Note"}
                    >
                      edit
                    </button>
                  </div>
                )
              )}
          </div>
        </div>
      </ModalNodeWidget>
    );
  }
}
