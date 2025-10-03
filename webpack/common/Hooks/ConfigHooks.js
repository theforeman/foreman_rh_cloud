import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import {
  ADVISOR_ENGINE_CONFIG_KEY,
  ADVISOR_ENGINE_CONFIG_PATH,
} from '../../InsightsCloudSync/Components/InsightsTable/InsightsTableConstants';
import { useForemanContext } from 'foremanReact/Root/Context/ForemanContext';

export const useIopConfig = () => {
  const result = useForemanContext().metadata?.foreman_rh_cloud?.iop;
  const skipApiRequest = result !== undefined;
  const { response: advisorEngineConfig } = useAPI(
    skipApiRequest ? null : 'get',
    ADVISOR_ENGINE_CONFIG_PATH,
    {
      key: ADVISOR_ENGINE_CONFIG_KEY,
    }
  );

  // eslint-disable-next-line camelcase
  return skipApiRequest ? result : advisorEngineConfig?.use_iop_mode;
};
