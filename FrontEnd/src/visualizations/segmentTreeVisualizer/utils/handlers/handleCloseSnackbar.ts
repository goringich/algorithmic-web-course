import { setSnackbar } from "../../../store/segmentTreeSlice";
import { AppDispatch } from "../../../store/store";

export const handleCloseSnackbar = (dispatch: AppDispatch) => {
  dispatch(setSnackbar({ message: "", open: false }));
};
