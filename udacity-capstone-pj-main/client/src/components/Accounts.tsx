import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createaccount, deleteaccount, getaccounts, patchaccount } from '../api/accounts-api'
import Auth from '../auth/Auth'
import { account } from '../types/Account'

interface accountsProps {
  auth: Auth
  history: History
}

interface accountsState {
  accounts: account[]
  newaccountName: string
  loadingaccounts: boolean
}

export class Accounts extends React.PureComponent<accountsProps, accountsState> {
  state: accountsState = {
    accounts: [],
    newaccountName: '',
    loadingaccounts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newaccountName: event.target.value })
  }

  onEditButtonClick = (accountId: string) => {
    this.props.history.push(`/accounts/${accountId}/edit`)
  }

  onaccountCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newaccount = await createaccount(this.props.auth.getIdToken(), {
        name: this.state.newaccountName,
        dueDate
      })
      this.setState({
        accounts: [...this.state.accounts, newaccount],
        newaccountName: ''
      })
    } catch {
      alert('account creation failed')
    }
  }

  onaccountDelete = async (accountId: string) => {
    try {
      await deleteaccount(this.props.auth.getIdToken(), accountId)
      this.setState({
        accounts: this.state.accounts.filter(account => account.accountId !== accountId)
      })
    } catch {
      alert('account deletion failed')
    }
  }

  onaccountCheck = async (pos: number) => {
    try {
      const account = this.state.accounts[pos]
      await patchaccount(this.props.auth.getIdToken(), account.accountId, {
        name: account.name,
        dueDate: account.dueDate,
        done: !account.done
      })
      this.setState({
        accounts: update(this.state.accounts, {
          [pos]: { done: { $set: !account.done } }
        })
      })
    } catch {
      alert('account update failed')
    }
  }

  async componentDidMount() {
    try {
      const accounts = await getaccounts(this.props.auth.getIdToken())
      this.setState({
        accounts,
        loadingaccounts: false
      })
    } catch (e) {
      alert(`Failed to fetch accounts`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Account List</Header>

        {this.renderCreateaccountInput()}

        {this.renderaccounts()}
      </div>
    )
  }

  renderCreateaccountInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New account',
              onClick: this.onaccountCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Input account information..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderaccounts() {
    if (this.state.loadingaccounts) {
      return this.renderLoading()
    }

    return this.renderaccountsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading accounts
        </Loader>
      </Grid.Row>
    )
  }

  renderaccountsList() {
    return (
      <Grid padded>
        {this.state.accounts.map((account, pos) => {
          return (
            <Grid.Row key={account.accountId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onaccountCheck(pos)}
                  checked={account.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {account.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {account.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(account.accountId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onaccountDelete(account.accountId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {account.attachmentUrl && (
                <Image src={account.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
