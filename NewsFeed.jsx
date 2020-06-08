import { Component } from 'react'
import api from './api' // some realtime API

/*
item: {
  id: string,
  title: string,
  text: string,
  likes: number
}
*/

const Item = props => (
  <div>
    <p>{props.title}</p>
    <p>{props.text}</p>
  </div>
)

class NewsFeed extends Component {
  state = {
    top: []
  }

  handleNewItem = item => {
    this.setState({
      top: [...this.state.top, item].sort((a, b) => b.likes - a.likes).slice(0, 100)
    })
  }

  handleDeleteItem = id => {
    this.setState({
      top: this.state.top.filter(item => item.id !== id)
    })
  }

  componentDidMount() {
    api.on('newItem', this.handleNewItem)
    api.on('deleteItem', this.handleDeleteItem)
  }

  componentWillUnmount() {
    api.off('newItem', this.handleNewItem)
    api.off('deleteItem', this.handleDeleteItem)
  }

  render() {
    return (
      <div>
        <p>Top 100 news:</p>
        {this.state.top.map(item =>
          <Item title={item.title} text={item.text} />
        )}
      </div>
    )
  }
}

export default NewsFeed
