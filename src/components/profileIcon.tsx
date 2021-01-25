import React, { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import { Modal, Button } from 'antd';
import Create from './create';
import Transfer from './transferDomains';

interface ProfileProps {
  domain: string;
}

const Profile: FC<ProfileProps> = ({ domain: _domain }) => {
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  const [isTransferVisible, setTransferVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  if (domain.isNothing()) return <p>Loading</p>;

  const showSubdomain = () => {
    setSubdomainVisible(true);
  };

  const subdomainOk = () => {
    setSubdomainVisible(false);
  };

  const subdomainCancel = () => {
    setSubdomainVisible(false);
  };

  const showTransfer = () => {
    setTransferVisible(true);
  };

  const transferOk = () => {
    setTransferVisible(false);
  };

  const transferCancel = () => {
    setTransferVisible(false);
  };

  const showProfile = () => {
    setProfileVisible(true);
  };

  const profileOk = () => {
    setProfileVisible(false);
  };

  const profileCancel = () => {
    setProfileVisible(false);
  };

  return (
    <>
      {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
        <>
          <button
            className="btn-sub"
            style={{ color: 'white' }}
            onClick={showProfile}
          >
            image field
          </button>

          <Modal
            title="subdomain"
            visible={isProfileVisible}
            onOk={profileOk}
            onCancel={profileCancel}
          >
            {domain.value.children}
            <Create domainId={domain.value.id} domainContext={domainContext} />
            <Transfer
              domainId={domain.value.id}
              domainContext={domainContext}
            />
          </Modal>
        </>
      ) : null}
    </>
  );
};
export default Profile;
