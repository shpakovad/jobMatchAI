import { withServerAccess } from "@/src/shared/hoc";
import { DemoAccessedPage, DemoAccessPage } from "@/src/widgets/demo-access";

const DemoAccess = withServerAccess(async ({ sessionId }: { sessionId?: string }) => {

  if (sessionId) {
    return <DemoAccessedPage />;
  }
  return <DemoAccessPage />;
});

export default DemoAccess;
