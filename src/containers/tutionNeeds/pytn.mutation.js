import { gql } from '@apollo/client';

export const CREATE_STUDENT_PYTN = gql`
  mutation CreateStudentPYTN($studentPYTNDto: CreateUpdateStudentPYTNDto!) {
    createStudentPYTN(studentPYTNDto: $studentPYTNDto) {
      id
    }
  }
`;
