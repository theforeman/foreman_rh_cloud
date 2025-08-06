import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import {
  ADVISOR_ENGINE_CONFIG_KEY,
  ADVISOR_ENGINE_CONFIG_PATH,
} from '../../InsightsCloudSync/Components/InsightsTable/InsightsTableConstants';

export const useAdvisorEngineConfig = () => {
  const { response: advisorEngineConfig } = useAPI(
    'get',
    ADVISOR_ENGINE_CONFIG_PATH,
    {
      key: ADVISOR_ENGINE_CONFIG_KEY,
    }
  );

  // eslint-disable-next-line camelcase
  return advisorEngineConfig?.use_iop_mode;
};
