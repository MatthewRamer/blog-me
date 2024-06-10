import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase.jsx';

const Oauth = () => {
    const auth = getAuth(app);

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            const result = await signInWithPopup(auth, provider);
            const userEmail = result.user.email;
            console.log(userEmail);

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail })
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                console.error('Failed to redirect');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <button onClick={handleGoogleClick}>Sign in with Google</button>
    );
};

export default Oauth;
