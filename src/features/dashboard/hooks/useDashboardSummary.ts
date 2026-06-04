import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../../api/taskFlowApi';
import { dashboardKeys } from '../dashboardQueryKeys';

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardApi.summary()
  });
}
