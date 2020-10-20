import { gql } from '@apollo/client';


export const CHECK_USER = gql`
    query {
        checkUser(phoneNumber: { countryCode: $countryCode, number: $number }) {
            isPasswordSet
        }
    }`;