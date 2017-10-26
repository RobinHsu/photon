import config from '../config';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Layout, Menu, Icon} from 'antd';
const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Layout>
        <Sider style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}>
          <div className="logo"/>
          <Menu
            mode="inline"
            theme="dark">
            {
              config.menus.map((menu, i) => {
                return menu.childrens ? (<SubMenu key={'sub' + i} title={<span><Icon type={menu.icon}/><span>{menu.title}</span></span>}>
                  {
                    menu.childrens.map((item, j) => (
                      <Menu.Item key={item.path}><Link to={item.path}>{item.title}</Link></Menu.Item>
                    ))
                  }
                </SubMenu>) : (<Menu.Item key={menu.path}><Link to={menu.path}>{menu.title}</Link></Menu.Item>);
              })
            }
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '15px 15px', overflow: 'initial' }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
