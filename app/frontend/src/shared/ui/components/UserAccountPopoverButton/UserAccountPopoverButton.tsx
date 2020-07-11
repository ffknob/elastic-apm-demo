import React, { useState } from 'react';

import { EuiButtonEmpty, EuiPopover } from '@elastic/eui';

import { useAuth } from '../../../hooks';
import { useLoading } from '../../../hooks';

import './UserAccountPopoverButton.scss';

export interface UserAccountPopoverButtonProps {
    signedInPopoverContent: React.ReactNode;
    notSignedInPopoverContent: React.ReactNode;
}

const UserAccountPopoverButton: React.FC<UserAccountPopoverButtonProps> = (
    props: UserAccountPopoverButtonProps
) => {
    const { signedInPopoverContent, notSignedInPopoverContent } = props;

    const { isLoading, loading } = useLoading();
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const {
        user,
        setUser,
        isSignedIn,
        setIsSignedIn,
        signIn,
        signOut
    } = useAuth(loading);

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
            {isSignedIn ? signedInPopoverContent : notSignedInPopoverContent}
        </EuiPopover>
    );
};

export default UserAccountPopoverButton;
