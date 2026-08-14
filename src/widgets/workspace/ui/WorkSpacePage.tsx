import { withServerAccess } from "@/src/entities/session-guard/server";
import { AccessedWorkSpacePage } from "@/src/widgets/workspace/ui/AccessedWorkSpace";

export const WorkSpacePage = withServerAccess(
  ({ remainingAnalyses }: { remainingAnalyses?: number }) => {
    return <AccessedWorkSpacePage remainingAnalyses={remainingAnalyses} />;
  },
);
