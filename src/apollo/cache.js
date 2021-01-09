import { makeVar } from '@apollo/client';

export const isTokenLoading = makeVar(true);

export const isLoggedIn = makeVar(false);

export const isSplashScreenVisible = makeVar(true);

export const userType = makeVar('');

export const networkConnectivityError = makeVar(false);

export const userDetails = makeVar({});

export const studentDetails = makeVar({});

export const tutorDetails = makeVar({});

export const userLocation = makeVar({});

export const offeringsMasterData = makeVar([]);

export const interestingOfferingData = makeVar([]);

export const notificationPayload = makeVar({});

export const notificationsList = makeVar([]);
