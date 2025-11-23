import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OPIMetric {
  id: string;
  name: string;
  category: string;
  value: number;
  change: number;
  status: string;
}

interface OPIState {
  metrics: OPIMetric[];
  loading: boolean;
  error: string | null;
}

const initialState: OPIState = {
  metrics: [],
  loading: false,
  error: null,
};

const opiSlice = createSlice({
  name: 'opi',
  initialState,
  reducers: {
    setMetrics(state, action: PayloadAction<OPIMetric[]>) {
      state.metrics = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setMetrics, setLoading, setError } = opiSlice.actions;
export default opiSlice.reducer;
