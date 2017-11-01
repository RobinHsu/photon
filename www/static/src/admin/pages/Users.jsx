import React, {Component} from 'react';
import {Button, Table} from 'antd';
import {getUser} from 'api/user';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  handleAdd = () => {
    this.props.history.push('/user/add');
  }

  async componentDidMount() {
    const {data} = await getUser();
    this.setState({
      data
    });
  }

  columns = [{
    title: '用户名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '笔名',
    dataIndex: 'pen_name',
    key: 'pen_name'
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => {
      return (
        <span></span>
      );
    }
  }];

  render() {
    return (
      <div>
        <div>
          <Button onClick={this.handleAdd}>添加账户</Button>
        </div>
        <Table columns={this.columns} dataSource={this.state.data} />
      </div>
    );
  }
}
