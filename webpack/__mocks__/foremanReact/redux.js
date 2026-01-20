const mockStore = {
  dispatch: jest.fn(),
  getState: jest.fn(() => ({
    API: {},
  })),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
};

export default mockStore;
