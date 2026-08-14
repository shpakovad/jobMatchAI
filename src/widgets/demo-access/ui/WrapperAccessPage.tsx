import { withServerAccess } from "@/src/entities/session-guard/server";
import { DemoAccessedPage, DemoAccessPage } from "@/src/widgets/demo-access";

export const WrapperAccessPage = withServerAccess(async ({ sessionId }: { sessionId?: string }) => {
  if (sessionId) {
    return <DemoAccessedPage />;
  }
  return <DemoAccessPage />;
});
