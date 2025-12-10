import { AccountRoutes } from "@services/api/AccountApi";
import { BasketRoutes } from "@services/api/BasketApi";
import { FruitRoutes } from "@services/api/FruitApi";
import { QuantityRoutes } from "@services/api/QuantityApi";
import { SessionRoutes } from "@services/api/SessionApi";
import { TaskRoutes } from "@services/api/TaskApi";
import { UserRoutes } from "@services/api/UserApi";
import { VerificationRoutes } from "@services/api/VerificationApi";

export type Routes<Input> = AccountRoutes<Input> &
    BasketRoutes<Input> &
    FruitRoutes<Input> &
    QuantityRoutes<Input> &
    SessionRoutes<Input> &
    TaskRoutes<Input> &
    UserRoutes<Input> &
    VerificationRoutes<Input>;
