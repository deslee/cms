import { FetchResult } from "apollo-boost";
import { MutationFn, MutationOptions, OperationVariables } from "react-apollo";

export async function mutateSafely<TData = any, TVariables = OperationVariables>(
    mutationFn: MutationFn<TData, TVariables>,
    data: string,
    options?: MutationOptions<TData, TVariables>,
    defaultErrorMessage = "Request failed"
): Promise<void | FetchResult<TData>> {
    let response: any;
    try {
        response = await mutationFn(options);
    } catch (e) {
        throw new Error("An unexpected error occurred")
    }
    const mutationResult = response && response.data[data];
    if (!mutationResult.success) {
        throw new Error(mutationResult.errorMessage || defaultErrorMessage);
    }
    return mutationResult;
}