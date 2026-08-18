import { WithServerAccessType } from "@/src/features/session-guard";
import { withServerAccess } from "@/src/features/session-guard/server";
import { AccessedWorkSpacePage } from "@/src/widgets/workspace/ui/AccessedWorkSpace";

export const WorkSpacePage = withServerAccess(({ remainingAnalyses }: WithServerAccessType) => {
  return <AccessedWorkSpacePage remainingAnalyses={remainingAnalyses} />;
});
