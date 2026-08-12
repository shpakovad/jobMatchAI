import { withServerAccess } from "@/src/shared/hoc";
import { AccessedWorkSpacePage } from "@/src/widgets/workspace/ui/AccessedWorkSpace";

export const WorkSpacePage = withServerAccess(async () => {
  return <AccessedWorkSpacePage />;
});
