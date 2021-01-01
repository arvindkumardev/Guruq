import { gql } from '@apollo/client';

export const CREATE_STUDENT_PYTN = gql`
  mutation CreateStudentPYTN($studentPYTNDto: CreateUpdateStudentPYTNDto!) {
    createStudentPYTN(studentPYTNDto: $studentPYTNDto) {
      id
    }
  }
`;

export const DELETE_STUDENT_PYTN = gql`
  mutation DeleteStudentPYTN($id: Int!) {
    deleteStudentPYTN(id: $id) {
      id
    }
  }
`;

export const ACCEPT_STUDENT_PYTN = gql`
  mutation AcceptStudentPYTN($studentPYTNAcceptDto: CreateUpdateStudentPYTNAcceptedDto!) {
    acceptStudentPYTN(studentPYTNAcceptDto: $studentPYTNAcceptDto) {
      id
    }
  }
`;
