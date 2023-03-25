import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from "./error";

import axios from "axios";

export const registerManufacturer = createAsyncThunk(
  "manufacturer/registerManufacturer",
  async (_, thunkAPI) => {
    try {
      console.log("trying to add manufacturer")
      const state = thunkAPI.getState();
      const response = await state.navbar?.instances?.addManufacturer();

      console.log("Manufacturer added to data", response);

      return response;
    } catch (err) {
      thunkAPI.dispatch(setError(err.response?.data?.message));
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const registerRetailer = createAsyncThunk(
  "manufacturer/registerRetailer",
  async (data, thunkAPI) => {
    try {
      const response = await thunkAPI.state.navbar.instances.addRetailer(data);

      console.log("Retailer added to data", response);

      return response;
    } catch (err) {
      thunkAPI.dispatch(setError(err.response?.data?.message));
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "manufacturer/addProduct",
  async (data, thunkAPI) => {
    try {
      const response = await thunkAPI.state.navbar.instances.addProduct(
        data.title,
        data.id,
        data.productImage,
        data.desc,
        data.expiryTime
      );

      console.log("Product Added", response);

      return response;
    } catch (err) {
      thunkAPI.dispatch(setError(err.response?.data?.message));
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const getQR = createAsyncThunk(
  "manufacturer/getQR",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post("endpoint", data);

      console.log("QR data:", response);

      return response;
    } catch (err) {
      thunkAPI.dispatch(setError(err.response?.data?.message));
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const manufacturerSlice = createSlice({
  name: "manufacturer",
  initialState: {
    loading: false,
    retailers: [],
    productId: null,
    error: null,
    qrData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    function onPending(state, action) {
      state.loading = true;
      state.error = null;
    }
    function onRejection(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
    builder.addCase(registerRetailer.fulfilled, (state, action) => {
      state.retailers = action.payload;
      state.loading = false;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.productId = action.payload;
      state.loading = false;
    });
    builder.addCase(getQR.fulfilled, (state, action) => {
      state.qrData = action.payload;
      state.loading = false;
    });
    builder.addCase(registerManufacturer.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder
      .addCase(registerRetailer.pending, onPending)
      .addCase(addProduct.pending, onPending)
      .addCase(getQR.pending, onPending)
      .addCase(registerManufacturer.pending, onPending);
    builder
      .addCase(registerRetailer.rejected, onRejection)
      .addCase(addProduct.rejected, onRejection)
      .addCase(getQR.rejected, onRejection)
      .addCase(registerManufacturer.rejected, onRejection);
  },
});

// export const { setError, clearError } = errorSlice.actions;
export default manufacturerSlice.reducer;
