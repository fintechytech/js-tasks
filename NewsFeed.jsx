import React, { useState, useEffect, useCallback } from "react";
import api from "./api"; // some realtime API

/*
item: {
  id: string,
  title: string,
  text: string,
  likes: number
}
*/

const Item = (props) => (
  <div>
    <p>{props.title}</p>
    <p>{props.text}</p>
  </div>
);

const NewsFeed = (props) => {
  const [top, setTop] = useState([]);

  const handleNewItem = useCallback((item) => {
    setTop((top) => {
      const newTop = [...top];
      if (newTop.length === 100) {
        if (item.likes < newTop[newTop.length - 1].likes) {
          return newTop;
        }
        newTop.pop();
      }
      const insertIndex = newTop.findIndex(
        (oldItem) => oldItem.likes <= item.likes
      );
      if (insertIndex === -1) {
        newTop.push(item);
      } else {
        newTop.splice(insertIndex, 0, item);
      }
      return newTop;
    });
  }, []);

  const handleDeleteItem = useCallback((id) => {
    setTop((top) => {
      return top.filter((item) => item.id !== id);
    });
  }, []);

  useEffect(() => {
    api.on("newItem", setTop);
    api.on("deleteItem", handleDeleteItem);

    return () => {
      api.off("newItem", handleNewItem);
      api.off("deleteItem", handleDeleteItem);
    };
  }, [handleNewItem, handleDeleteItem]);

  return (
    <div>
      <p>Top 100 news:</p>
      {top.map((item) => (
        <Item key={item.id} title={item.title} text={item.text} />
      ))}
    </div>
  );
};

export default NewsFeed;
