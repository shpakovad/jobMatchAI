import { WithServerAccessType } from "@/src/features/session-guard";
import { withServerAccess } from "@/src/features/session-guard/server";
import { DemoAccessedPage, DemoAccessPage } from "@/src/widgets/demo-access";

export const WrapperAccessPage = withServerAccess(async ({ sessionId }: WithServerAccessType) => {
  if (sessionId) {
    return <DemoAccessedPage />;
  }
  return <DemoAccessPage />;
});
