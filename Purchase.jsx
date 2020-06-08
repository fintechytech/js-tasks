import React from 'react'

const api = {
  /**
   * This method must be called when user clicks the "purchase" button
   */
  purchase: async () => {
    // an errror may be thrown
    // throw new Error("Request error")

    return 42
  }
}


class Purchase extends React.Component {
  render() {
    return (
      <div>
        <button>Purchase</button>
        <p className="successText">Purchase completed!</p>
        <p className="errorText">An error occurred!</p>
      </div>
    )
  }
}

export default Purchase
