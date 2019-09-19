import * as React from "react";
import domtoimage from "dom-to-image";
import randomString from "random-string";
import ModalFunnelWidget from "../../../../common/ModalFunnelWidget";
import ClickOutside from "../../../../common/ClickOutside";
import { ReactComponent as FunnelNotesSVG } from "../../../../../assets/FunnelNotes.svg";

export default class FunnelNotesRightPanel extends React.Component {
  state = {
    showNotes: false,
    note: ""
  };

  showNotes = () =>
    this.setState({
      showNotes: true,
      showMenu: false,
      funnelNotes:
        (this.props.work.diagram && this.props.work.diagram.funnelNotes) || []
    });
  hideNotes = () => this.setState({ showNotes: false });

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  saveDiagramHandle = file =>
    this.setState(
      {
        snackMsg: "next",
        converted: this.props.app.serialization(
          this.props.app.getDiagramEngine().getDiagramModel()
        )
      },
      () => {
        this.props.work.saveDiagram(this.props.work.funnelId, this.state, file);
      }
    );

  addNoteToNotebook = () => {
    if (this.state.note.length > 0) {
      let notebook = this.state.funnelNotes;
      notebook.push(this.state.note);
      // console.log(this.state)

      this.setState({ note: "", funnelNotes: notebook });
    }
  };

  delete = index => {
    this.state.funnelNotes.splice(index, 1);
    document.getElementById("diagram-layer").click();
  };

  render() {
    // console.log(this.props.work.diagram && this.props.work.diagram.funnelNotes)
    return (
      <>
        {this.props.work.pathname.includes("diagram") ? (
          <>
            <button
              className="diagram-header-menu-button"
              onClick={this.showNotes}
              // style={{ background: this.state.showNotes ? "#ecf1f2" : "#fff" }}
              title={"Funnel Notes"}
            >
              <FunnelNotesSVG />
            </button>
          </>
        ) : null}

        <ClickOutside
          onClickOutside={() => {
            this.setState({ showNotes: false });
          }}
        >
          <ModalFunnelWidget
            show={this.state.showNotes}
            handleClose={this.hideNotes}
            style={{
              position: "absolute",
              top: 65
            }}
          >
            <label className="label-create-widget-settings">Funnel Notes</label>
            <div
              style={{
                padding: 15,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <label htmlFor="FunnelNotes" className="label-input">
                Funnel Notes
              </label>

              <textarea
                style={{
                  height: 100,
                  borderRadius: 5,
                  border: "1px solid rgb(191, 207, 233)",
                  padding: 10,
                  maxWidth: "90%",
                  minWidth: "90%",
                  width: "90%"
                }}
                placeholder="Start typing your note.."
                type="text"
                value={this.state.note}
                onChange={this.handleChange}
                name="note"
              />

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

              <button
                className="btn btn-1 create-project-button-in-modal"
                style={{ display: "block" }}
                onClick={() => {
                  let diagram = document.getElementById("diagram-layer");
                  domtoimage
                    .toBlob(diagram)
                    .then(data => {
                      let name = randomString({ length: 10 });
                      var file = new File([data], name, { type: "image/svg" });
                      this.saveDiagramHandle(file);
                    })
                    .catch(function(error) {
                      console.error("oops, something went wrong!", error);
                    });
                }}
              >
                Save
              </button>

              {this.props.work.message && (
                <div
                  className="input-group"
                  style={{
                    display: "flex",
                    margin: "20px auto"
                  }}
                >
                  {this.props.work.message}
                </div>
              )}

              <div
                style={{
                  height: "532px",
                  overflow: "auto"
                }}
              >
                {this.state.funnelNotes &&
                  this.state.funnelNotes.map((item, index) => (
                    // console.log(item)
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        margin: 5
                      }}
                    >
                      <textarea
                        style={{
                          // height: 100,
                          borderRadius: 5,
                          border: "1px solid rgb(191, 207, 233)",
                          padding: 10,
                          backgroundColor: "#ffefc1",
                          maxWidth: "90%",
                          minWidth: "90%",
                          width: "90%"
                        }}
                        placeholder="Start typing your note.."
                        type="text"
                        value={item}
                        onChange={() => {}}
                      />
                      <button
                        onClick={() => this.delete(index)}
                        style={{
                          position: "absolute",
                          top: -6,
                          left: -10,
                          border: 0,
                          cursor: "pointer",
                          margin: "inherit",
                          padding: "0px 4px 2px 4px",
                          borderRadius: "35%",
                          fontSize: 14,
                          backgroundColor: "#ffabab"
                        }}
                        title={"Delete Note"}
                      >
                        x
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </ModalFunnelWidget>
        </ClickOutside>
      </>
    );
  }
}
