import { Component, useState, useEffect, useCallback } from 'react'
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

const NewsFeed = props => {
    const [top, setTop] = useState([])

    const handleNewItem = useCallback(item => {
        setTop([...top, item].sort((a, b) => b.likes - a.likes).slice(0, 100))
    }, [top])

    const handleDeleteItem = useCallback(id => {
        setTop(top.filter(item => item.id !== id))
    }, [top])

    useEffect(() => {
        api.on('newItem', handleNewItem)
        api.on('deleteItem', handleDeleteItem)

        return () => {
            api.off('newItem', handleNewItem)
            api.off('deleteItem', handleDeleteItem)
        }
    }, [handleNewItem, handleDeleteItem])

    return (
      <div>
        <p>Top 100 news:</p>
        {top.map(item =>
          <Item title={item.title} text={item.text} />
        )}
      </div>
    )
}

export default NewsFeed
