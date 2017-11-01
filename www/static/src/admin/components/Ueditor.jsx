import React from 'react';
const {UE} = window;

export default class Ueditor extends React.Component {
  componentDidMount() {
    this.initEditor();
  }

  componentWillUnmount() {
    UE.delEditor(this.props.id);
  }

  initEditor() {
    const {id} = this.props;
    const uEditor = UE.getEditor(this.props.id, {});
    uEditor.ready((ueditor) => {
      if (!ueditor) {
        UE.delEditor(id);
        this.initEditor();
      }
    });
  }

  render() {
    return (
      <div id={this.props.id} name="content" type="text/plain"></div>
    );
  }
}
