import { useState, ChangeEvent } from "react";
import GetStarted from "./get-started-sdk/getStartedSdk"
import config from "./agora-manager/config";
import "./App.css";

type SelectedOption = "getStarted";

type SelectedProduct = "videoCalling";

function App() {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>();
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct>();

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as SelectedOption);
  };

  const handleProductChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value as SelectedProduct);
    if (event.target.value === "ILS") {
      config.selectedProduct = "live";
    } else {
      config.selectedProduct = "rtc";
    }
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "getStarted":
        return <GetStarted />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h3>Choose a product:</h3>
      <select value={selectedProduct} onChange={handleProductChange}>
        <option value="">Select</option>
        <option value="videoCalling">Video Calling</option>
      </select>
      <h3>Select a sample code:</h3>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Select</option>
        <option value="getStarted">Get Started</option>
      </select>
      {renderSelectedOption()}
    </div>
  );
}

export default App;
