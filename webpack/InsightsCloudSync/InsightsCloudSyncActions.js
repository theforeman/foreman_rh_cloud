import API from 'foremanReact/API';

export const syncInsights = () => dispatch => {
  API.post('tasks');
  dispatch({
    type: 'syncTask',
    payload: {},
  });
};
