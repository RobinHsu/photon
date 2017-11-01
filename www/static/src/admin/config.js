import Users from './pages/Users';
import UserAdd from './pages/UserAdd';
import PostAdd from './pages/PostAdd';

export default {
  menus: [{
    title: '网站首页',
    icon: 'home',
    path: '/'
  }, {
    title: '内容',
    icon: 'home',
    childrens: [{
      title: '发布',
      icon: '',
      path: '/post/add'
    }, {
      title: '管理',
      icon: '',
      path: '/post'
    }]
  }, {
    title: '设置',
    icon: 'home',
    childrens: [{
      title: '账户设置',
      icon: '',
      path: '/users'
    }]
  }],
  routes: [{
    path: '/users',
    main: Users
  }, {
    path: '/user/add',
    main: UserAdd
  }, {
    path: '/post/add',
    main: PostAdd
  }]
};
