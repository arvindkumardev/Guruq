const QUALIFICATION_DATA = [
  {
    id: 1,
    name: 'All Qualifications',
    checked: true,
    filterData: { degreeLevel: 0 },
    displayValue: '',
  },
  {
    id: 2,
    name: 'Secondary',
    checked: false,
    filterData: { degreeLevel: 1 },
    displayValue: 'Secondary',
  },
  {
    id: 3,
    name: 'Higher Secondary',
    checked: false,
    filterData: { degreeLevel: 2 },
    displayValue: 'Higher Secondary',
  },
  {
    id: 4,
    name: 'Diploma',
    checked: false,
    filterData: { degreeLevel: 3 },
    displayValue: 'Diploma',
  },
  {
    id: 5,
    name: 'Bachelors',
    checked: false,
    filterData: { degreeLevel: 4 },
    displayValue: 'Bachelors',
  },
  {
    id: 6,
    name: 'PG Diploma',
    checked: false,
    filterData: { degreeLevel: 5 },
    displayValue: 'PG Diploma',
  },
  {
    id: 7,
    name: 'Masters',
    checked: false,
    filterData: { degreeLevel: 6 },
    displayValue: 'Masters',
  },
  {
    id: 8,
    name: 'Doctoral',
    checked: false,
    filterData: { degreeLevel: 7 },
    displayValue: 'Doctoral',
  },
  {
    id: 9,
    name: 'Other',
    checked: false,
    filterData: { degreeLevel: 8 },
    displayValue: 'Other',
  },
];

const EXPERIENCE_DATA = [
  { name: '10+', filterData: { experience: 10 }, id: 1, checked: false, displayValue: '10 years' },
  { name: '7+', filterData: { experience: 7 }, id: 2, checked: false, displayValue: '7 years' },
  { name: '3+', filterData: { experience: 3 }, id: 3, checked: false, displayValue: '3 years' },
  { name: '2+', filterData: { experience: 2 }, id: 4, checked: false, displayValue: '2 years' },
  { name: 'Any', filterData: { experience: 0 }, id: 5, checked: true, displayValue: '' },
];

const PRICE_DATA = [
  {
    name: 'All Prices',
    checked: true,
    filterData: { minBudget: 0, maxBudget: 0 },
    id: 1,
    displayValue: '',
  },
  {
    name: 'Under ₹250',
    checked: false,
    filterData: { minBudget: 0, maxBudget: 250 },
    id: 2,
    displayValue: '0 - 250',
  },
  {
    name: '₹250 - ₹500',
    checked: false,
    filterData: { minBudget: 250, maxBudget: 500 },
    id: 3,
    displayValue: '250 - 500',
  },
  {
    name: '₹500 - ₹750',
    checked: false,
    filterData: { minBudget: 500, maxBudget: 750 },
    id: 4,
    displayValue: '500 - 750',
  },
  {
    name: '₹750 - ₹1000',
    checked: false,
    filterData: { minBudget: 750, maxBudget: 1000 },
    id: 5,
    displayValue: '750 - 1000',
  },
  {
    name: '₹1000 - ₹1500',
    checked: false,
    filterData: { minBudget: 1000, maxBudget: 1500 },
    id: 6,
    displayValue: '1000 - 1500',
  },
  {
    name: '₹1500 - ₹2000',
    checked: false,
    filterData: { minBudget: 1500, maxBudget: 2000 },
    id: 7,
    displayValue: '1500 - 2000',
  },
  {
    name: 'Over ₹2000',
    checked: false,
    filterData: { minBudget: 2000, maxBudget: 10000 },
    id: 8,
    displayValue: '2000 +',
  },
];

const RATING_DATA = [
  { name: '5', filterData: { averageRating: 5 }, id: 1, checked: false, displayValue: 'Rating 5' },
  { name: '4', filterData: { averageRating: 4 }, id: 2, checked: false, displayValue: 'Rating 4' },
  { name: '3', filterData: { averageRating: 3 }, id: 3, checked: false, displayValue: 'Rating 3' },
  { name: '2', filterData: { averageRating: 2 }, id: 4, checked: false, displayValue: 'Rating 2' },
  { name: 'Any', filterData: { averageRating: 0 }, id: 5, checked: true, displayValue: '' },
];

const SORT_DATA = [
  {
    name: 'Experience',
    checked: true,
    id: 1,
    filterData: { sortBy: 'tutor.teachingExperience', sortOrder: 'DESC' },
    displayValue: '',
  },
  {
    name: 'Budget - High to Low',
    checked: false,
    id: 2,
    filterData: { sortBy: 'budgets.price', sortOrder: 'DESC' },
    displayValue: 'Budget - High to Low',
  },
  {
    name: 'Budget - Low to High',
    checked: false,
    id: 3,
    filterData: { sortBy: 'budgets.price', sortOrder: 'ASC' },
    displayValue: 'Budget - Low to High',
  },
];

const MODE_OF_CLASS_DATA = [
  { name: 'Any', checked: true, id: 1, filterData: { teachingMode: 0 }, displayValue: '' },
  { name: 'Online', checked: false, id: 2, filterData: { teachingMode: 1 }, displayValue: 'Online' },
  { name: 'Offline', checked: false, id: 3, filterData: { teachingMode: 2 }, displayValue: 'Offline' },
];

export const FILTER_DATA = [
  {
    id: 1,
    name: 'Qualifications',
    checked: false,
    filterType: 'radio',
    filterLabel: 'Qualifications',
    data: QUALIFICATION_DATA,
  },
  {
    id: 2,
    name: 'Experience',
    checked: false,
    minVal: 'Any',
    maxVal: '10',
    filterLabel: 'Experience',
    filterType: 'range',
    data: EXPERIENCE_DATA,
  },
  {
    id: 3,
    name: 'Price',
    checked: false,
    filterLabel: 'Price',
    filterType: 'radio',
    data: PRICE_DATA,
  },
  {
    id: 4,
    name: 'Rating',
    checked: false,
    filterLabel: 'Any +',
    filterType: 'range',
    minVal: 'Any',
    maxVal: '5',
    data: RATING_DATA,
  },
  {
    id: 5,
    name: 'Mode of Class',
    checked: false,
    filterLabel: 'Mode of Class',
    filterType: 'radio',
    data: MODE_OF_CLASS_DATA,
  },
  {
    id: 6,
    name: 'Sort By',
    checked: true,
    filterLabel: 'Sort By',
    filterType: 'radio',
    data: SORT_DATA,
  },
];

export const TEMP_FILTER_DATA = {
  1: QUALIFICATION_DATA.find((item) => item.id === 1),
  2: EXPERIENCE_DATA.find((item) => item.id === 5),
  3: PRICE_DATA.find((item) => item.id === 1),
  4: RATING_DATA.find((item) => item.id === 5),
  5: MODE_OF_CLASS_DATA.find((item) => item.id === 1),
  6: SORT_DATA.find((item) => item.id === 1),
};
