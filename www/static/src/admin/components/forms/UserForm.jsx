import React, {Component} from 'react';
import {
  Form,
  Input,
  Tooltip,
  Row,
  Col,
  Button
} from 'antd';
const FormItem = Form.Item;

class BaseUserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      const msg = 'Two passwords that you enter is inconsistent!';
      callback(msg);
    } else {
      callback();
    }
  }

  checkConfirm = (rule, value, callback) => {
    const {form} = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFileds(['confirm'], {force: true});
    }
    callback();
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

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 6
        }
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="账户名"
          hasFeedback
        >
          {getFieldDecorator('username', {
            rules: [{
              required: true, message: '请输入账户名'
            }],
            validateTrigger: 'onBlur'
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码'
            }, {
              validator: this.checkConfirm
            }],
            validateTrigger: 'onBlur'
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="校验密码"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请再次输入密码'
            }, {
              validator: this.checkPassword
            }],
            validateTrigger: 'onBlur'
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="笔名"
          hasFeedback
        >
          {getFieldDecorator('pen_name', {
            rules: [{
              required: true, message: '请输入笔名'
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
  }
}

const UserForm = Form.create()(BaseUserForm);

export default UserForm;
