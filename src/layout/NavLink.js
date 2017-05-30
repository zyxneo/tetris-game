import React from "react"
import { Link } from "react-router"

export default React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  render() {
    let isActive = this.context.router.isActive(this.props.to, true),
            className = isActive ? "list-inline-item active" : "list-inline-item";

    return (
      <li className={className}>
        <Link {...this.props}>
          {this.props.children}
        </Link>
      </li>
    )
  }
})
