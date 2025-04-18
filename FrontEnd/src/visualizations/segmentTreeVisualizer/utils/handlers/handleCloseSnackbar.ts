import { setSnackbar } from "../../../store/slices/segmentTreeSlice";
import { AppDispatch } from "../../../store/store";

export const handleCloseSnackbar = (dispatch: AppDispatch) => {
  dispatch(setSnackbar({ message: "", open: false }));
};
