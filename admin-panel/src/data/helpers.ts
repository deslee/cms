import { FetchResult } from "apollo-boost";
import { MutationFn, MutationOptions, OperationVariables } from "react-apollo";

export async function mutateSafely<TData = any, TVariables = OperationVariables>(
    mutationFn: MutationFn<TData, TVariables>,
    options?: MutationOptions<TData, TVariables>): Promise<void | FetchResult<TData>> {
    try {
        return await mutationFn(options);
    } catch (e) {
        console.error(e);
        throw new Error("An unexpected error occurred")
    }
}