export const get = data => ({ type: 'get-some-type', ...data });
export const put = data => ({ type: 'put-some-type', ...data });
export const post = data => ({ type: 'post-some-type', ...data });
export const patch = data => ({ type: 'patch-some-type', ...data });

export const API = {
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};
