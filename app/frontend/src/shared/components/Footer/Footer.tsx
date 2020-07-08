import React from 'react';

import { EuiLink } from '@elastic/eui';

import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer>
      Flávio Franco Knob ©{'  '}
      <EuiLink href="mailto:ffknob@gmail.com">ffknob@gmail.com</EuiLink>
    </footer>
  );
};

export default Footer;
