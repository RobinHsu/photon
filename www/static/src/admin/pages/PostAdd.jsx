import React, {Component} from 'react';
import PostForm from 'components/forms/PostForm';

export default class extends Component {
  render() {
    return (
      <div>
        <PostForm {...this.props}/>
      </div>
    );
  }
}
