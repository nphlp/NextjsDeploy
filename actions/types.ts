export type ActionResponse<T> =
    | {
          data: T;
          error?: undefined;
      }
    | {
          data?: undefined;
          error: string;
      };
