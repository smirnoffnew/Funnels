import { NodeModel } from "storm-react-diagrams";
import { CustomPortModel } from "./CustomPortModel";

export class CustomNodeModel extends NodeModel {
  constructor(name) {
    super(name);
    this.addPort(new CustomPortModel(name, "top"));
    this.addPort(new CustomPortModel(name, "left"));
    this.addPort(new CustomPortModel(name, "bottom"));
    this.addPort(new CustomPortModel(name, "right"));

    this.extras.name = this.named;
    this.extras.setNameExtras = this.setNameExtras;
    this.setName = this.setName;

    this.extras.notes = this.notesd;
    this.extras.setNotesExtras = this.setNotesExtras;
    this.setNotes = this.setNotes;

    this.extras.height = this.heightd;
    this.extras.setHeightExtras = this.setHeightExtras;
    this.setHeight = this.setHeight;

    this.extras.width = this.widthd;
    this.extras.setWidthExtras = this.setWidthExtras;
    this.setWidth = this.setWidth;

    this.extras.trigger = this.triggerd;
    this.extras.setTriggerExtras = this.setTriggerExtras;
    this.setTrigger = this.setTrigger;

    this.extras.goal = this.goald;
    this.extras.setGoalExtras = this.setGoalExtras;
    this.setGoal = this.setGoal;

    this.extras.url = this.url;
    this.extras.setUTMLinkExtras = this.setUTMLinkExtras;
    this.setUTMLink = this.setUTMLink;

    this.extras.originalUrl = this.originalUrl;
    this.extras.setUTMLinkOriginalExtras = this.setUTMLinkOriginalExtras;
    this.setUTMLinkOriginal = this.setUTMLinkOriginal;

    this.extras.script = this.scriptd;
    this.extras.setScriptExtras = this.setScriptExtras;
    this.setScript = this.setScript;

    this.extras.sourceLink  =  this.sourceLink
    this.extras.setSourceLink = this.setSourceLinkExtras
    this.setSourceLink = this.setSourceLink
  }

  setNameExtras(name) {
    this.named = name;
  }
  setName(name) {
    this.extras.named = name;
  }
  
  setNotesExtras(notes) {
    this.notesd = notes;
  }
  setNotes(notes) {
    this.extras.notesd = notes;
  }

  setHeightExtras(height) {
    this.heightd = height;
  }
  setHeight(height) {
    this.extras.heightd = height;
  }

  setWidthExtras(width) {
    this.widthd = width;
  }
  setWidth(width) {
    this.extras.widthd = width;
  }

  setTriggerExtras(trigger) {
    this.triggerd = trigger;
  }
  setTrigger(trigger) {
    this.extras.triggerd = trigger;
  }

  setGoalExtras(goal) {
    this.goald = goal;
  }
  setGoal(goal) {
    this.extras.goald = goal;
  }

  setUTMLinkExtras(UTMLink) {
    this.url = UTMLink;
  }
  setUTMLink(UTMLink) {
    this.extras.url = UTMLink;
  }

  setUTMLinkOriginalExtras(UTMLink) {
    this.originalUrl = UTMLink;
  }
  setUTMLinkOriginal(UTMLink) {
    this.extras.originalUrl = UTMLink;
  }

  setScriptExtras(script) {
    this.scriptd = script;
  }
  setScript(script) {
    this.extras.scriptd = script;
  }
  setSourceLinkExtras(sourceLink){
    this.sourceLink = sourceLink
  } 
  setSourceLink(sourceLink){
    this.extras.sourceLink = sourceLink
  }

}
