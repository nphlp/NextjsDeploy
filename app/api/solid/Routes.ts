import { AccountRoutes } from "@services/api/AccountApi";
import { SessionRoutes } from "@services/api/SessionApi";
import { TaskRoutes } from "@services/api/TaskApi";
import { UserRoutes } from "@services/api/UserApi";
import { VerificationRoutes } from "@services/api/VerificationApi";

export type Routes<Input> = AccountRoutes<Input> &
    SessionRoutes<Input> &
    TaskRoutes<Input> &
    UserRoutes<Input> &
    VerificationRoutes<Input>;
