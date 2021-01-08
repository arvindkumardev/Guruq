import * as DeviceInfo from 'react-native-device-info';

export const APP_VERSION_IOS = DeviceInfo.getVersion();

export const APP_VERSION_ANDROID = DeviceInfo.getVersion();

export const STANDARD_SCREEN_SIZE = 812;

export const STANDARD_SCREEN_DIMENSIONS = { height: 812, width: 375 };

export const ANDROID_PACKAGE_NAME = 'in.guruq';

export const AUTH_TOKEN = 'AUTH_TOKEN';

export const LOCAL_STORAGE_DATA_KEY = {
  USER_TOKEN: 'userToken',
  ONBOARDING_SHOWN: 'onboarding_shown',
  COMPARE_TUTOR_ID: 'compare_tutors',
  NOTIFICATION_LIST: 'notification_list',
};

export const inputs = {};

export const IND_COUNTRY_OBJ = {
  dialCode: '91',
  iso2: 'in',
  name: 'India',
  nationality: 'IN',
  mobileCode: 'India: 0091',
};

export const LOTTIE_JSON_FILES = {
  loaderJson: require('../assets/json/loader1.json'),
};

export const FRONTEND_URL = 'http://stagingv2.guruq.in';
export const DASHBOARD_URL = 'http://dashboardv2.guruq.in';
// export const API_URL = 'http://apiv2.guruq.in/api';
export const API_URL = 'http://10.0.0.6:5000';
export const ATTACHMENT_PREVIEW_URL = 'http://10.0.0.6:5000/upload';
export const IMAGES_BASE_URL = 'https://guruq.in/guruq-new';

export const GENERAL_FAQ_URL = `${DASHBOARD_URL}/faqs/general-issues`;
export const QPOINTS_FAQ_URL = `${DASHBOARD_URL}/faqs/qpoints-faqs`;
export const BOOKING_FAQ_URL = `${DASHBOARD_URL}/faqs/booking-faqs`;
export const LEGAL_FAQ_URL = `${DASHBOARD_URL}/faqs/legal-terms-conditions`;

export const ABOUT_US_URL = `https://guruq.in/about-us`;
export const CEO_MESSAGE_URL = `https://guruq.in/ceo-message`;
export const CSR_URL = `https://guruq.in/guruq-csr`;
export const IN_NEWS_URL = 'https://guruq.in/guruq-in-news';
export const ACADEMIC_BOARD_URL = 'https://guruq.in/academic-board';

export const SCHOOL_EDUCATION = 'School Education';
export const COMPETITIVE_EXAM = 'Competitive Exam';
export const STUDY_ABROAD = 'Study Abroad';
export const LANGUAGE_LEARNING = 'Language Learning';

export const STUDY_AREA_LEVELS = {
  [SCHOOL_EDUCATION]: [
    { level: 0, name: 'studyArea', label: 'School Education' },
    { level: 1, name: 'board', label: 'Board' },
    { level: 2, name: 'grade', label: 'Grade' },
    { level: 3, name: 'subject', label: 'Subjects' },
  ],
  [COMPETITIVE_EXAM]: [
    { level: 0, name: 'studyArea', label: 'Competitive Exam' },
    { level: 1, name: 'category', label: 'Exam Category' },
    { level: 2, name: 'title', label: 'Exam' },
    { level: 3, name: 'subject', label: 'Subjects' },
  ],
  [STUDY_ABROAD]: [
    { level: 0, name: 'studyArea', label: 'Study Abroad' },
    { level: 1, name: 'test', label: 'Exam' },
    { level: 2, name: 'subject', label: 'Subjects' },
  ],
  [LANGUAGE_LEARNING]: [
    { level: 0, name: 'studyArea', label: 'Language Learning' },
    { level: 1, name: 'language', label: 'Language' },
    { level: 2, name: 'level', label: 'Language Level' },
  ],
};

export const GOOGLE_API_KEY = 'AIzaSyD8MaEzNhuejY2yBx6No7-TfkAvQ2X_wyk';
