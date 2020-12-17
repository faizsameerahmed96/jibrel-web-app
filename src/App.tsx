import React from 'react';

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import api from './api'

import './App.css';


function App() {
  let [state, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case 'setContractAddress': {
        return { ...state, contractAddress: action.value }
      }
      case 'setWalletAddress': {
        return { ...state, walletAddress: action.value }
      }
      case 'setLoading': {
        return {
          ...state, loading: action.loading,
        }
      }
      case 'setLogs': {
        return {
          ...state, loading: false, logs: action.logs, mode: 'displayLogs'
        }
      }
      case 'setPage': {
        return {
          ...state, loading: true, page: action.page, logs: []
        }
      }
      case 'cancel': {
        return {
          ...state, loading: false, logs: [], mode: 'default', page: 0
        }
      }
    }
  }, {
    contractAddress: '', walletAddress: '', loading: false, page: 0, mode: 'default', error: '', logs: []
  })

  const getTokenTxns = async () => {
    try {
      let result = await api.getTokenTxns(state.contractAddress, state.walletAddress, state.page)
      dispatch({ type: 'setLogs', logs: result.data })
    } catch (err) {
      console.error(err)
    }
  }

  const onGetLogsClicked = async () => {
    await dispatch({ type: 'setLoading', loading: true })

    await getTokenTxns()
  }

  const cancel = async () => {
    dispatch({ type: 'cancel' })
  }

  const setPage = (page) => {
    dispatch({ type: 'setPage', page })
  }

  React.useEffect(() => {
    if (state.mode == 'displayLogs') {
      getTokenTxns()
    }
  }, [state.page])

  if (state.loading) return <p>Loading...</p>

  return (
    <div className="App">
      <h1 style={{}}>Transfer/Approval Events</h1>
      <p>Get all transfer/approval events for a particular wallet for any ERC20 token</p>

      <TextField disabled={state.loading || state.mode == 'displayLogs'} onChange={e => dispatch({ type: 'setContractAddress', value: e.target.value })} value={state.contractAddress} style={{ marginTop: 16 }} className='textfield' variant='outlined' label='Contract Address' />
      <TextField disabled={state.loading || state.mode == 'displayLogs'} onChange={e => dispatch({ type: 'setWalletAddress', value: e.target.value })} value={state.walletAddress} style={{ marginTop: 8 }} className='textfield' variant='outlined' label='Wallet Address' />
      <Button onClick={state.mode == 'default' ? onGetLogsClicked : cancel} style={{ marginTop: 16 }} className='button' variant='contained' color='primary'>{state.mode == 'default' ? 'Get Logs' : 'Cancel'}</Button>

      {
        state.mode == 'displayLogs' ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableCell>Type</TableCell>
                <TableCell>From/Owner</TableCell>
                <TableCell>To/Sender</TableCell>
                <TableCell>Amount</TableCell>
              </TableHead>
              <TableBody>
                {state.logs.map(log => (
                  <TableRow>
                    <TableCell>{log.event}</TableCell>
                    <TableCell>{log.returnValues.from || log.returnValues.owner}</TableCell>
                    <TableCell>{log.returnValues.to || log.returnValues.spender}</TableCell>
                    <TableCell>{log.returnValues.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 32, marginBottom: 32 }}>
              <Button onClick={() => setPage(state.page - 1)} disabled={state.page == 0} style={{ marginRight: 16 }} variant='outlined'>Previous</Button>
              <p>Page {state.page + 1}</p>
              <Button onClick={() => setPage(state.page + 1)} disabled={state.logs.length < 20} style={{ marginLeft: 16 }} variant='outlined'>Next</Button>
            </div>
          </TableContainer>
        ) : null
      }
    </div>
  );
}

export default App;
