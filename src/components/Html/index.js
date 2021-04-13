import React from 'react';

export default class Html extends React.Component {
  render() {
    const { component, children, ...others } = this.props;
    const Component = component || 'div';
    return (
      <Component dangerouslySetInnerHTML={{ __html: children }} {...others} />
    );
  }
}
