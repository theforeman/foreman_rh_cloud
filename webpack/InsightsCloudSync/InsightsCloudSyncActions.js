import API from 'foremanReact/API';

export const syncInsights = () => dispatch => {
  let processController = null;
  let processStatusName = null;

  API.post('tasks');
  dispatch({
    type: 'syncTask',
    payload: {
    },
  });
};
