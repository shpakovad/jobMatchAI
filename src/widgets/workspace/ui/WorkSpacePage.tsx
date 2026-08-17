import { WithServerAccessType } from "@/src/entities/session-guard";
import { withServerAccess } from "@/src/entities/session-guard/server";
import { AccessedWorkSpacePage } from "@/src/widgets/workspace/ui/AccessedWorkSpace";

export const WorkSpacePage = withServerAccess(({ remainingAnalyses }: WithServerAccessType) => {
  return <AccessedWorkSpacePage remainingAnalyses={remainingAnalyses} />;
});
