import { AccountRoutes } from "@services/api/AccountApi";
import { ClockRoutes } from "@services/api/ClockApi";
import { ContractRoutes } from "@services/api/ContractApi";
import { DayRoutes } from "@services/api/DayApi";
import { LeaveRoutes } from "@services/api/LeaveApi";
import { ScheduleRoutes } from "@services/api/ScheduleApi";
import { SessionRoutes } from "@services/api/SessionApi";
import { TaskRoutes } from "@services/api/TaskApi";
import { UserRoutes } from "@services/api/UserApi";
import { VerificationRoutes } from "@services/api/VerificationApi";

export type Routes<Input> = AccountRoutes<Input> &
    ClockRoutes<Input> &
    ContractRoutes<Input> &
    DayRoutes<Input> &
    LeaveRoutes<Input> &
    ScheduleRoutes<Input> &
    SessionRoutes<Input> &
    TaskRoutes<Input> &
    UserRoutes<Input> &
    VerificationRoutes<Input>;
