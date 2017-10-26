import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Layout from 'components/Layout';
import config from './config';
const {routes} = config;

const App = (props) => (
  <Router basename="admin">
    <Layout {...props}>
      {
        routes.map((route, i) => (
          <Route key={i} path={route.path} exact={route.exact}
            component={route.main}/>
        ))
      }
    </Layout>
  </Router>
);

export default App;
