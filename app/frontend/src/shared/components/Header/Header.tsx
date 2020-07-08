import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';

import {
  EuiHeaderSectionItemButton,
  EuiHeaderLogo,
  EuiHeader,
  EuiCollapsibleNav,
  EuiCollapsibleNavGroup,
  EuiFlexItem,
  EuiIcon,
  EuiButtonEmpty,
  EuiListGroup,
  EuiListGroupItem,
  EuiListGroupItemProps,
  EuiShowFor,
} from '@elastic/eui';

import AuthContext from '../../context/AuthContext';
import IAuthContext from '../../interfaces/AuthContext';

import config from '../../config/Config';

import './Header.scss';

const Header: React.FC = (props) => {
  const [navIsOpen, setNavIsOpen] = useState(
    JSON.parse(String(localStorage.getItem('navIsDocked'))) || false
  );

  const [navIsDocked, setNavIsDocked] = useState(
    JSON.parse(String(localStorage.getItem('navIsDocked'))) || false
  );

  const [openGroups, setOpenGroups] = useState(
    JSON.parse(String(localStorage.getItem('openNavGroups'))) || [
      'APM',
      'Learn',
      'User',
    ]
  );

  const history = useHistory();

  const authContext: IAuthContext = useContext(AuthContext);

  const user = authContext.user;

  const toggleAccordion = (isOpen: boolean, title?: string) => {
    if (!title) return;
    const itExists = openGroups.includes(title);
    if (isOpen) {
      if (itExists) return;
      openGroups.push(title);
    } else {
      const index = openGroups.indexOf(title);
      if (index > -1) {
        openGroups.splice(index, 1);
      }
    }
    setOpenGroups([...openGroups]);
    localStorage.setItem('openNavGroups', JSON.stringify(openGroups));
  };

  const redirect = (to: string) => {
    setNavIsOpen(false);
    history.push(to);
  };

  const apmLinks: EuiListGroupItemProps[] = [
    { label: 'Simulate', onClick: () => redirect('/simulate') },
    { label: 'APM', href: config.apm.url, target: '_blank' },
  ];

  const learnLinks: EuiListGroupItemProps[] = [
    {
      label: 'APM Server reference',
      href: 'https://www.elastic.co/guide/en/apm/server/master/index.html',
      target: '_blank',
    },
    {
      label: 'APM Node.js Agent',
      href:
        'https://www.elastic.co/guide/en/apm/agent/nodejs/master/index.html',
      target: '_blank',
    },
    {
      label: 'Blogs',
      href: 'https://www.elastic.co/search?fv-website_area=blog&q=apm&size=20',
      target: '_blank',
    },
    {
      label: 'Webinars',
      href:
        'https://www.elastic.co/search?fv-website_area=videos&q=apm&size=20',
      target: '_blank',
    },
  ];

  const userLinks: EuiListGroupItemProps[] = [
    { label: 'Sign In', href: '#/navigation/collapsible-nav' },
    { label: 'Sign up', href: '#/navigation/collapsible-nav' },
  ];

  const collapsibleNav = (
    <EuiCollapsibleNav
      id="guideCollapsibleNavAllExampleNav"
      aria-label="Main navigation"
      isOpen={navIsOpen}
      isDocked={navIsDocked}
      button={
        <EuiHeaderSectionItemButton
          aria-label="Toggle main navigation"
          onClick={() => setNavIsOpen(!navIsOpen)}>
          <EuiIcon type={'menu'} size="m" aria-hidden="true" />
        </EuiHeaderSectionItemButton>
      }
      onClose={() => setNavIsOpen(false)}>
      <EuiFlexItem className="eui-yScroll">
        <EuiCollapsibleNavGroup
          title="APM"
          iconType="logoAPM"
          isCollapsible={true}
          initialIsOpen={openGroups.includes('APM')}
          onToggle={(isOpen: boolean) => toggleAccordion(isOpen, 'APM')}>
          <EuiListGroup
            aria-label="APM"
            listItems={apmLinks}
            maxWidth="none"
            color="subdued"
            gutterSize="none"
            size="s"
          />
        </EuiCollapsibleNavGroup>

        <EuiCollapsibleNavGroup
          title="Learn"
          iconType="training"
          isCollapsible={true}
          initialIsOpen={openGroups.includes('Learn')}
          onToggle={(isOpen: boolean) => toggleAccordion(isOpen, 'Learn')}>
          <EuiListGroup
            aria-label="Learn"
            listItems={learnLinks}
            maxWidth="none"
            color="subdued"
            gutterSize="none"
            size="s"
          />
        </EuiCollapsibleNavGroup>

        <EuiCollapsibleNavGroup
          title="User"
          iconType="user"
          isCollapsible={true}
          initialIsOpen={openGroups.includes('User')}
          onToggle={(isOpen: boolean) => toggleAccordion(isOpen, 'User')}>
          <EuiListGroup
            aria-label="User"
            listItems={userLinks}
            maxWidth="none"
            color="subdued"
            gutterSize="none"
            size="s"
          />
        </EuiCollapsibleNavGroup>

        <EuiShowFor sizes={['l', 'xl']}>
          <EuiCollapsibleNavGroup>
            <EuiListGroupItem
              size="xs"
              color="subdued"
              label={`${navIsDocked ? 'Undock' : 'Dock'} navigation`}
              onClick={() => {
                setNavIsDocked(!navIsDocked);
                localStorage.setItem(
                  'navIsDocked',
                  JSON.stringify(!navIsDocked)
                );
              }}
              iconType={navIsDocked ? 'lock' : 'lockOpen'}
            />
          </EuiCollapsibleNavGroup>
        </EuiShowFor>
      </EuiFlexItem>
    </EuiCollapsibleNav>
  );

  const leftSectionItems = [
    collapsibleNav,
    <EuiHeaderLogo iconType="logoElastic">Elastic APM Demo</EuiHeaderLogo>,
  ];

  return (
    <EuiHeader
      position="fixed"
      sections={[
        {
          items: leftSectionItems,
          borders: 'right',
        },
        {
          items: [
            <EuiButtonEmpty
              iconType="user"
              onClick={() => console.log('a')}></EuiButtonEmpty>,
          ],
        },
      ]}
    />
  );
};

export default Header;
