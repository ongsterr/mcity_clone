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
import { firebasePlayers, firebase } from '../../../firebase'
import { firebaseLooper, reverseArray } from '../../utils/misc'

const AdminPlayers = () => {
  const [state, setState] = useState({
    isLoading: true,
    players: [],
  })

  useEffect(() => {
    firebasePlayers.once('value').then(snapshot => {
      const players = firebaseLooper(snapshot)
      setState({
        isLoading: false,
        players: reverseArray(players),
      })
    })
  }, [])

  const displayPlayers = () =>
    state.players.map((player, i) => (
      <TableRow key={i}>
        <TableCell>
          <Link to={`/admin_players/edit_player/${player.id}`}>
            {player.name}
          </Link>
        </TableCell>
        <TableCell>
          <Link to={`/admin_players/edit_player/${player.id}`}>
            {player.lastname}
          </Link>
        </TableCell>
        <TableCell>
          <Link to={`/admin_players/edit_player/${player.id}`}>
            {player.number}
          </Link>
        </TableCell>
        <TableCell>
          <Link to={`/admin_players/edit_player/${player.id}`}>
            {player.position}
          </Link>
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
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Position</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{state.players ? displayPlayers() : null}</TableBody>
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

export default AdminPlayers
