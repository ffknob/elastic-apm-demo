import React, { useState } from 'react';

import { EuiButtonEmpty, EuiPopover } from '@elastic/eui';

import { useAuth } from '../../../hooks';
import { useLoading } from '../../../hooks';

import './UserAccountButton.scss';

export interface UserAccountButtonProps {
    loggedInPopoverContent: React.ReactNode;
    notLoggedInPopoverContent: React.ReactNode;
}

const UserAccountButton: React.FC<UserAccountButtonProps> = (
    props: UserAccountButtonProps
) => {
    const { loggedInPopoverContent, notLoggedInPopoverContent } = props;

    const { isLoading, loading } = useLoading();
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const { user, setUser, isLoggedIn, setIsLoggedIn, login, logout } = useAuth(
        loading
    );

    const button = (
        <EuiButtonEmpty
            iconType="user"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}></EuiButtonEmpty>
    );

    return (
        <EuiPopover
            ownFocus
            button={button}
            isOpen={isPopoverOpen}
            closePopover={() => setIsPopoverOpen(false)}
            anchorPosition="downRight">
            {isLoggedIn ? loggedInPopoverContent : notLoggedInPopoverContent}
        </EuiPopover>
    );
};

export default UserAccountButton;
