import { withServerAccess } from "@/src/shared/hoc";
import { DemoAccessedPage, DemoAccessPage } from "@/src/widgets/demo-access";

export const WrapperAccessPage = withServerAccess(async ({ sessionId }: { sessionId?: string }) => {
  if (sessionId) {
    return <DemoAccessedPage />;
  }
  return <DemoAccessPage />;
});
