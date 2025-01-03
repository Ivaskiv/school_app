import axios from './infrastructure/api/init';

export const registerSchoolAndAdmin = async data => {
  return await axios.post('/auth/registerSchoolAndAdmin', data);
};

export const loginAdmin = async credentials => {
  return await axios.post('/auth/login', credentials);
};

export const loginUser = async credentials => {
  return await axios.post('/auth/loginUser', credentials);
};

export const registerUser = async data => {
  return await axios.post('/auth/registerUser', data);
};

export const updateUser = async data => {
  return await axios.put('/auth/updateUser', data);
};

export const logout = async () => {
  return await axios.post('/auth/logout');
};
