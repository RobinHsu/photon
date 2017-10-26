import React, {Component} from 'react';
import {Button} from 'antd';

export default class extends Component {
  handleAdd = () => {
    this.props.history.push('/user/add');
  }

  render() {
    return (
      <div>
        <div>
          <Button onClick={this.handleAdd}>添加账户</Button>
        </div>
      </div>
    );
  }
}
