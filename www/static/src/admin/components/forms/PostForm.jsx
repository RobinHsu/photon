import React, {Component} from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Button
} from 'antd';
import Ueditor from 'components/Ueditor';

const FormItem = Form.Item;

class BasePostForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false
    };
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14}
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout} label="标题">
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: '请输入标题'
            }],
            validateTrigger: 'onBlur'
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout} label="链接名">
          {getFieldDecorator('pathname', {
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem label="正文">
          <Ueditor id="content"/>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
  }
}

const PostForm = Form.create()(BasePostForm);

export default PostForm;
