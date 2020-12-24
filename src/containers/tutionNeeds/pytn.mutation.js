import { gql } from '@apollo/client';

export const CREATE_STUDENT_PYTN = gql`
  mutation CreateStudentPYTN($studentPYTNDto: CreateUpdateStudentPYTNDto!) {
    createStudentPYTN(studentPYTNDto: $studentPYTNDto) {
      id
    }
  }
`;


export const DELETE_STUDENT_PYTN = gql`
  mutation DeleteStudentPYTN($studentPytnId: Int!) {
    deleteStudentPYTN(studentPytnId: $studentPytnId) {
      id
    }
  }
`;
