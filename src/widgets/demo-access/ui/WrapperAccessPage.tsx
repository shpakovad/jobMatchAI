import { WithServerAccessType } from "@/src/entities/session-guard";
import { withServerAccess } from "@/src/entities/session-guard/server";
import { DemoAccessedPage, DemoAccessPage } from "@/src/widgets/demo-access";

export const WrapperAccessPage = withServerAccess(async ({ sessionId }: WithServerAccessType) => {
  if (sessionId) {
    return <DemoAccessedPage />;
  }
  return <DemoAccessPage />;
});
