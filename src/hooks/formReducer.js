export const initialState = {
  schoolName: '',
  schoolAddress: '',
  schoolEmail: '',
  userName: '',
  userEmail: '',
  userPassword: '',
};

export const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.name]: action.value };
    default:
      return state;
  }
};
