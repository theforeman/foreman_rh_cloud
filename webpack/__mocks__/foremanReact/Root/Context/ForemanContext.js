export const useForemanSettings = jest.fn(() => ({ perPage: 20 }));
export const useForemanOrganization = jest.fn(() => ({
  id: 1,
  title: 'some-org',
}));
export const useForemanContext = jest.fn(() => ({ metadata: {} }));
