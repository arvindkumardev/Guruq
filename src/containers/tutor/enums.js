export const TutorCertificationStageEnum = {
  REGISTERED: { value: 1, label: 'REGISTERED' },
  OFFERING_PENDING: { value: 2, label: 'OFFERING_PENDING' },
  PROFICIENCY_TEST_PENDING: { value: 3, label: 'PROFICIENCY_TEST_PENDING' },
  PROFILE_COMPLETION_PENDING: { value: 4, label: 'PROFILE_COMPLETION_PENDING' },
  INTERVIEW_PENDING: { value: 5, label: 'INTERVIEW_PENDING' },
  BACKGROUND_CHECK_PENDING: { value: 6, label: 'BACKGROUND_CHECK_PENDING' },
  CERTIFICATION_PROCESS_COMPLETED: { value: 7, label: 'CERTIFICATION_PROCESS_COMPLETED' },
};

export const InterviewStatus = {
  NOT_SCHEDULED: { value: 1, label: 'NOT_SCHEDULED' },
  SCHEDULED: { value: 2, label: 'SCHEDULED' },
  RESCHEDULED: { value: 3, label: 'RESCHEDULED' },
  CLEARED: { value: 4, label: 'CLEARED' },
  NOT_CLEARED: { value: 5, label: 'NOT_CLEARED' },
  NOT_INTERESTED: { value: 6, label: 'NOT_INTERESTED' },
  EXEMPTED: { value: 7, label: 'EXEMPTED' },
};

export const InterviewMode = {
  ONLINE: { value: 1, label: 'ONLINE' },
  OFFLINE: { value: 2, label: 'OFFLINE' },
  NA: { value: 3, label: 'NA' },
};

export const ExemptionFromEnum = {
  PROFICIENCY_TEST: { value: 1, label: 'PROFICIENCY_TEST' },
  INTERVIEW: { value: 2, label: 'INTERVIEW' },
  BACKGROUND_CHECK: { value: 3, label: 'BACKGROUND_CHECK' },
  DOCUMENTS: { value: 4, label: 'DOCUMENTS' },
};
export const PtStatus = {
  PENDING: { value: 1, label: 'PENDING' },
  PASSED: { value: 2, label: 'PASSED' },
  FAILED: { value: 3, label: 'FAILED' },
  EXEMPTED: { value: 4, label: 'EXEMPTED' },
};

export const TutorOfferingStageEnum = {
  PT_PENDING: { value: 1, label: 'PT_PENDING' },
  BUDGET_PENDING: { value: 2, label: 'BUDGET_PENDING' },
  OFFERING_DETAILED_PENDING: { value: 3, label: 'OFFERING_DETAILED_PENDING' },
  COMPLETED: { value: 4, label: 'COMPLETED' },
};

export const BackgroundCheckStatus = {
  NOT_STARTED: { value: 1, label: 'NOT_STARTED' },
  PENDING: { value: 2, label: 'PENDING' },
  COMPLETED: { value: 3, label: 'COMPLETED' },
  EXEMPTED: { value: 4, label: 'EXEMPTED' },
};
