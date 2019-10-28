import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

class HeaderNavigationBox extends React.Component {
  render() {
    return (
      <ul className={this.props.className}>
        <li>
          <NavLink
            exact={true}
            to={'/projects'}
            className="menu-item-burger"
            activeClassName="menu-item-burger-active"
          >
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink
            exact={true}
            to={'/templates'}
            className="menu-item-burger"
            activeClassName="menu-item-burger-active"
          >
            Templates
          </NavLink>
        </li>
        <li>
          <NavLink
            exact={false}
            to={'/collaborations'}
            className="menu-item-burger"
            activeClassName="menu-item-burger-active"
          >
            Collaborations
          </NavLink>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://funnelsmap.com/helpdesk/"
            className="menu-item-burger"
            activeClassName="menu-item-burger-active"
          >
            Helpdesk
          </a>
        </li>

        {
          !localStorage.getItem('token2') &&
          <>
            <li>
              <NavLink
                exact={false}
                to={'/settings'}
                className="menu-item-burger"
                activeClassName="menu-item-burger-active"
              >
                Settings
              </NavLink>
            </li>
            {
              this.props.pathname.includes('settings') &&
              <>
                <li
                  style={{
                    background: '#1c2434'
                  }}
                >
                  <NavLink
                    exact={true}
                    to={'/settings'}
                    className="menu-item-burger"
                    activeClassName="menu-settings-burger-active"
                    style={{
                      paddingLeft: 40,
                    }}
                  >
                    Account Details
                  </NavLink>
                </li>

                <li
                  style={{
                    background: '#1c2434'
                  }}
                >
                  <NavLink
                    exact={false}
                    to={'/settings/users'}
                    className="menu-item-burger"
                    activeClassName="menu-settings-burger-active"
                    style={{
                      paddingLeft: 40,
                    }}
                  >
                    Users
                  </NavLink>
                </li>
              </>
            }
          </>
        }

      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    pathname: state.router.location.pathname,
  };
}

export default connect(
  mapStateToProps
)(HeaderNavigationBox);
