import React, { FC, useCallback, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useZnsContracts } from "../lib/contracts";
import { useDomainCache } from "../lib/useDomainCache";
import { Form, Field } from "react-final-form";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Owned: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { controlled } = useDomainCache();

  if (controlled.isNothing()) return <p>User owns no domains.</p>;

  return (
    <>
      <div>Domains Owned by {account}:</div>
      {controlled.value.map((control) => {
        return (
          <div>
            <Link
              to={"/" + control.domain.replace(/\./, "/")}
              key={control.domain}
            >
              {control.domain}
            </Link>
            {console.log(control.domain)}
          </div>
        );
      })}
    </>
  );
};

export default Owned;
