import { withServerAccess } from "@/src/shared/hoc/withServerAccess";
import { AccessedWorkSpacePage } from "@/src/widgets/workspace/ui/AccessedWorkSpace";

export const WorkSpacePage = withServerAccess(async () => {
  return <AccessedWorkSpacePage />;
});
