import React from "react";

const api = {
  /**
   * This method must be called when user clicks the "purchase" button
   */
  purchase: async () => {
    // an errror may be thrown
    // throw new Error("Request error");

    await new Promise((resolve) =>
      setTimeout(() => {
        resolve("result");
      }, 1000)
    );

    return 42;
  }
};

class Purchase extends React.Component {
  state = {
    purchaseStatus: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.purchaseStatus !== this.state.purchaseStatus;
  }

  onPurchaseClick = async () => {
    this.setState({
      purchaseStatus: "pending"
    });
    try {
      await api.purchase();
      this.setState({
        purchaseStatus: "success"
      });
    } catch (e) {
      this.setState({
        purchaseStatus: "error"
      });
    }
  };

  render() {
    const { purchaseStatus } = this.state;
    return (
      <div>
        <button
          disabled={purchaseStatus === "pending"}
          onClick={this.onPurchaseClick}
        >
          Purchase
        </button>
        {purchaseStatus === "success" && (
          <p className="successText">Purchase completed!</p>
        )}
        {purchaseStatus === "error" && (
          <p className="errorText">An error occurred!</p>
        )}
      </div>
    );
  }
}

export default Purchase;
