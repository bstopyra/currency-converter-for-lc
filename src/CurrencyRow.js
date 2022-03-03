import React from "react";
import { NumericInput, Select } from "@livechat/design-system";

export default function CurrencyRow({
  currencyOptions,
  selectedCurrency,
  onCurrencySelect,
  onChangeAmount,
  amount,
}) {
  const getItemBody = (props) => {
    if (!props) {
      return null;
    }
    return <div id={props.name}>{props.name}</div>;
  };

  const getSelectedItemBody = (props) => {
    return <div id={props.name}>{props.name}</div>;
  };

  return (
    <div style={{ display: "flex" }}>
      <Select
        items={currencyOptions}
        getItemBody={getItemBody}
        search
        searchProperty="name"
        getSelectedItemBody={getSelectedItemBody}
        selected={selectedCurrency}
        onItemSelect={onCurrencySelect}
      />
      <NumericInput
        width="140px"
        value={amount}
        noControls
        onChange={onChangeAmount}
      />
    </div>
  );
}
