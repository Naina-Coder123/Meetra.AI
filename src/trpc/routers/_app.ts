import { agentsRouter } from '@/modules/agents/server/procedure';
import { premiumRouter } from '@/modules/premium/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedure';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  premium: premiumRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;