import { createSlice } from '@reduxjs/toolkit';

const modalAuthSlice = createSlice({
  name: 'modalAuth',
  initialState: {
    modalType: null,
  },
  reducers: {
    openModal: (state, action) => {
      state.modalType = action.payload.modalType;
    },
    closeModal: state => {
      state.modalType = null;
    },
  },
});

export const { openModal, closeModal } = modalAuthSlice.actions;
export default modalAuthSlice.reducer;
