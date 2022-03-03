import { Button, Loader } from "@livechat/design-system";
import { createDetailsWidget } from "@livechat/agent-app-sdk";
import { useState, useEffect } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";

const BASE_URL =
  "https://freecurrencyapi.net/api/v2/latest?apikey=40cda8c0-9aeb-11ec-a01c-3763d6334e6b";

function App() {
  const [widget, setWidget] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState();
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRates, setExchangeRates] = useState(1);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;

  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRates[toCurrency];
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRates[fromCurrency];
  }

  useEffect(() => {
    createDetailsWidget().then((widget) => {
      setWidget(widget);
    });
  }, []);

  function handlePutMessage() {
    widget.putMessage(
      `${fromAmount}${fromCurrency} is equal to ${toAmount}${toCurrency}`
    );
  }

  useEffect(() => {
    fetch(`${BASE_URL}&base_currency=EUR`)
      .then((res) => res.json())
      .then((data) => {
        setCurrencyOptions(
          Object.keys(data.data)
            .sort()
            .map(function (value) {
              return { key: value, props: { name: value } };
            })
        );
        setFromCurrency("EUR");
        setToCurrency("PLN");
      });
  }, []);

  useEffect(() => {
    if (fromCurrency) {
      fetch(`${BASE_URL}&base_currency=${fromCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          setExchangeRates(data.data);
        });
    }
  }, [fromCurrency]);

  const handleSetFromCurrency = (currency) => {
    setFromCurrency(currency);
  };

  const handleSetToCurrency = (currency) => {
    setToCurrency(currency);
  };

  const handleFromAmountChange = (e) => {
    setAmount(e);
    setAmountInFromCurrency(true);
  };

  const handleToAmountChange = (e) => {
    setAmount(e);
    setAmountInFromCurrency(false);
  };

  if (!currencyOptions) {
    return <Loader />;
  }

  return (
    <div className="wrapper">
      <div className="box">
        <h1>Currency converter</h1>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onCurrencySelect={handleSetFromCurrency}
          amount={fromAmount}
          onChangeAmount={handleFromAmountChange}
        />
        <div className="equals">=</div>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onCurrencySelect={handleSetToCurrency}
          amount={toAmount}
          onChangeAmount={handleToAmountChange}
        />
        <Button
          style={{ width: "80%", margin: "10px" }}
          kind="primary"
          onClick={handlePutMessage}
        >
          Send the conversion
        </Button>
      </div>
    </div>
  );
}

export default App;
