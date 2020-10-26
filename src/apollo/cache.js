import { makeVar } from '@apollo/client';

export const isTokenLoading = makeVar(true);

export const isLoggedIn = makeVar(false);

export const networkConnectivityError = makeVar(false);

export const userDetails = makeVar({});
