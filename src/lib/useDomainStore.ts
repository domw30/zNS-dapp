import {
  ApolloQueryResult,
  DocumentNode,
  gql,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useLazyQuery,
  useQuery,
} from "@apollo/client";
import { Web3Provider } from "@ethersproject/providers";
import { Query, queryByRole } from "@testing-library/react";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Maybe } from "true-myth";
import { useZnsContracts } from "./contracts";
import { getDomainId } from "./domains";
const { Just, Nothing } = Maybe;

interface Domain {
  id: string;
  domain: string;
  children: string[];
  owner: string;
  controller: string;
}

interface ControlledDomainsData {
  domains: Domain[];
}

interface DomainData {
  domain: Domain;
}

interface DomainState {
  domains: { [id: string]: Domain };
  controlled: Domain[];
}

const domainQuery = gql`
  query Domain($id: ID!) {
    domain(id: $id) {
      id
      domain
      children
      owner
      controller
    }
  }
`;

const controlledDomainsQuery = gql`
  query ControlledDomains($owner: Bytes!) {
    domains(where: { owner: $owner }) {
      id
      domain
      children
      owner
      controller
    }
  }
`;

type RefetchQuery<T> = (
  variables: Partial<Record<string, any>>
) => Promise<ApolloQueryResult<T>>;

function useDomain(id: string) {
  const { error, data, refetch } = useQuery<DomainData>(domainQuery, {
    variables: { id },
  });

  const _domain: Maybe<Domain> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return new Just(data.domain);
    }
    return new Nothing();
  }, [data]);

  return { domain: _domain, refetchDomain: refetch };
}

function createUseDomain(
  setState: (domain: Maybe<Domain>) => void
): (
  domain: string
) => {
  domain: Maybe<Domain>;
  refetchDomain: RefetchQuery<DomainData>;
} {
  return (domain: string) => {
    const { domain: _domain, refetchDomain } = useDomain(
      domain === "_root" ? "0" : getDomainId(domain)
    );
    useEffect(() => setState(_domain), [_domain]);

    return { domain: _domain, refetchDomain };
  };
}

function useControlledDomains(): {
  controlled: Maybe<Domain[]>;
  refetchControlled: RefetchQuery<ControlledDomainsData>;
} {
  const context = useWeb3React<Web3Provider>();
  const { library, account, active, chainId } = context;
  const [
    getControlled,
    { data, refetch, error },
  ] = useLazyQuery<ControlledDomainsData>(controlledDomainsQuery, {
    variables: { owner: account },
  });

  const controlled: Maybe<Domain[]> = useMemo(() => {
    if (error) {
      // TODO: maybe throw?
      console.error(error);
    }
    if (data) {
      return new Just(data.domains);
    }
    return new Nothing();
  }, [data]);
  useEffect(() => {
    if (refetch) {
      refetch({ variables: { owner: account } });
    } else if (account) {
      getControlled({ variables: { owner: account } });
    }
  }, [account]);
  return { controlled, refetchControlled: refetch! };
}

const useDomainStore = () => {
  const [state, setState] = useState<DomainState>({
    domains: {},
    controlled: [],
  });
  const getDomain = createUseDomain(
    useCallback(
      (domain: Maybe<Domain>) => {
        if (domain.isJust()) {
          const _domain = domain.unsafelyUnwrap();
          const domains = { ...state.domains, [_domain.domain]: _domain };
          setState({ ...state, domains });
        }
      },
      [state, setState]
    )
  );
  const controlled = useControlledDomains();

  return { getDomain, ...controlled, state };
};

export { useDomainStore };
