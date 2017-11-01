import React, {Component} from 'react';
import UserForm from 'components/forms/UserForm';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        <UserForm {...this.props}/>
      </div>
    );
  }
}
