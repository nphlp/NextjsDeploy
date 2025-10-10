import { AccountRoutes } from "@services/api/AccountApi";
import { ContractRoutes } from "@services/api/ContractApi";
import { LeaveRoutes } from "@services/api/LeaveApi";
import { SessionRoutes } from "@services/api/SessionApi";
import { TaskRoutes } from "@services/api/TaskApi";
import { TimeEntryRoutes } from "@services/api/TimeEntryApi";
import { UserRoutes } from "@services/api/UserApi";
import { VerificationRoutes } from "@services/api/VerificationApi";
import { WorkDayRoutes } from "@services/api/WorkDayApi";
import { WorkScheduleRoutes } from "@services/api/WorkScheduleApi";

export type Routes<Input> = AccountRoutes<Input> &
    ContractRoutes<Input> &
    LeaveRoutes<Input> &
    SessionRoutes<Input> &
    TaskRoutes<Input> &
    TimeEntryRoutes<Input> &
    UserRoutes<Input> &
    VerificationRoutes<Input> &
    WorkDayRoutes<Input> &
    WorkScheduleRoutes<Input>;
