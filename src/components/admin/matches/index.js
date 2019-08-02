import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import AdminLayout from '../../../hoc/AdminLayout'
import { firebaseMatches, firebase } from '../../../firebase'
import { firebaseLooper, reverseArray } from '../../utils/misc'

const AdminMatches = () => {
  const [state, setState] = useState({
    isLoading: true,
    matches: [],
  })

  useEffect(() => {
    firebaseMatches.once('value').then(snapshot => {
      const matches = firebaseLooper(snapshot)
      setState({
        isLoading: false,
        matches: reverseArray(matches),
      })
    })
  }, [])

  const displayMatches = () =>
    state.matches.map((match, i) => (
      <TableRow key={i}>
        <TableCell>{match.date}</TableCell>
        <TableCell>
          <Link to={`/admin_matches/edit_match/${match.id}`}>
            {match.away} <strong> - </strong> {match.local}
          </Link>
        </TableCell>
        <TableCell>
          {match.resultAway} <strong> - </strong> {match.resultLocal}
        </TableCell>
        <TableCell>
          {match.final === 'Yes' ? (
            <span className="matches_tag_red">Final</span>
          ) : (
            <span className="matches_tag_green">Not played yet</span>
          )}
        </TableCell>
      </TableRow>
    ))

  return (
    <AdminLayout>
      <div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Match</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{state.matches ? displayMatches() : null}</TableBody>
          </Table>
        </Paper>
        <div className="admin_progress">
          {state.isLoading ? (
            <CircularProgress thickness={7} style={{ color: '#98c5e9' }} />
          ) : null}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminMatches
