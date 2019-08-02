import React from 'react'
import { Switch } from 'react-router-dom'

import Layout from './hoc/Layout'
import Home from './components/home'
import SignIn from './components/signin'
import Dashboard from './components/admin/Dashboard'
import PrivateRoute from './components/authRoutes/PrivateRoutes'
import PublicRoute from './components/authRoutes/PublicRoutes'
import AdminMatches from './components/admin/matches'
import AddEditMatch from './components/admin/matches/AddEditMatch'

const Routes = props => {
  return (
    <div>
      <Layout>
        <Switch>
          <PrivateRoute
            {...props}
            path="/admin_matches/add_match"
            exact
            component={AddEditMatch}
          />
          <PrivateRoute
            {...props}
            path="/admin_matches/edit_match/:id"
            exact
            component={AddEditMatch}
          />
          <PrivateRoute
            {...props}
            path="/admin_matches"
            exact
            component={AdminMatches}
          />
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
