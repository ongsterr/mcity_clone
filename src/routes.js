import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Layout from './hoc/Layout'
import Home from './components/home'
import SignIn from './components/signin'
import Dashboard from './components/admin/Dashboard'
import PrivateRoute from './components/authRoutes/PrivateRoutes'
import PublicRoute from './components/authRoutes/PublicRoutes'

const Routes = props => {
  return (
    <div>
      <Layout>
        <Switch>
          <PrivateRoute
            {...props}
            path="/dashboard"
            exact
            component={Dashboard}
          />
          <PublicRoute
            {...props}
            restricted={true}
            path="/sign_in"
            exact
            component={SignIn}
          />
          <PublicRoute
            {...props}
            restricted={false}
            path="/"
            exact
            component={Home}
          />
        </Switch>
      </Layout>
    </div>
  )
}
export default Routes
