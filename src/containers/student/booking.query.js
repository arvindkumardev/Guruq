// query {
//   getCartItems {
//     id
//     offering {
//       id
//       name
//     }
//     tutor {
//       id
//     }
//     tutorOffering {
//       id
//     }
//     count
//     groupSize
//     price
//     demo
//     onlineClass
//     pointsRedeemed
//     payees {
//       id
//     }
//     promotion {
//       id
//     }
//   }
// }



// query {
//   getPendingBooking {
//     id
//     uuid
//     orderStatus
//     owner {
//       id
//     }
//     orderItems {
//       id
//     }
//     orderStatus
//     orderPayment {
//       id
//       paymentStatus
//     }
//   }
// }



// query {
//   getScheduledClasses(
//     classesSearchDto: {
//       studentId: 11631
//       startDate: "2020-11-07T17:00:00Z"
//       endDate: "2020-11-07T19:00:00Z"
//     }
//   ) {
//     id
//     uuid
//
//     student {
//       id
//     }
//     tutor {
//       id
//       contactDetail {
//         firstName
//         lastName
//       }
//     }
//     offering {
//       id
//       displayName
//     }
//     onlineClass
//     demo
//     status
//     startDate
//     endDate
//   }
// }



// query {
//   getBookings {
//     id
//     uuid
//     orderStatus
//     owner {
//       id
//     }
//     orderItems {
//       id
//       count
//       availableClasses
//     }
//     orderStatus
//     orderPayment {
//       id
//       paymentStatus
//     }
//   }
// }


