import { useForemanContext } from 'foremanReact/Root/Context/ForemanContext';

export const useIopConfig = () =>
  // eslint-disable-next-line camelcase
  useForemanContext().metadata?.foreman_rh_cloud?.iop === true;
