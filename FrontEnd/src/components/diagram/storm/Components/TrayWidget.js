import * as React from "react";
import { ReactComponent as SearchProjectsSVG } from '../../../../assets/SearchProjects.svg'

export class TrayWidget extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.children)
      return {
        itemsFromNextProps: nextProps.children,
      };
    else
      return null
  }

  filterList = e => {
    let updatedList = this.state.itemsFromNextProps &&
      this.state.itemsFromNextProps.filter(item => {
        return item.props.model.type.toLowerCase().search(
          e.target.value.toLowerCase()) !== -1;
      });
    this.setState({ items: updatedList });
  }

  render() {
    const showHideClassName = this.props.show ? "select display-block" : "select display-none";
    return (
      <div className={showHideClassName}>
        <div className='tray-wrapper'>
          <input type="text" placeholder="Search" onChange={e => this.filterList(e)} />
          <div style={{
            position: 'absolute',
            right: 22,
            top: 22,
          }}>
            <SearchProjectsSVG />
          </div>
          <div id='tray'>
            {this.state.items ? this.state.items : this.props.children}
          </div>
        </div>
      </div>
    );
  }
}