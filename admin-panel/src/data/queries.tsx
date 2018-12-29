import * as React from 'react'
import { wrapDisplayName } from 'recompose'
import { Query, OperationVariables, QueryResult } from 'react-apollo';
import gql from 'graphql-tag';

export interface QueryExternalProps<TVariables> {
    variables: TVariables
}

export interface QueryInjectedProps<TData, TVariables> {
    result: QueryResult<TData, TVariables>
}

export interface QueryOptions {
    query: any
}

export const withSiteQuery = <TData, TVariables = OperationVariables>(options: QueryOptions) => {
    return <OriginalProps extends {}>(
        Component: React.ComponentType<OriginalProps & QueryInjectedProps<TData, TVariables>>
    ) => {
        const { query } = options;

        class WithSiteQuery extends React.Component<OriginalProps & QueryExternalProps<TVariables>> {

            render() {
                const { variables, ...rest } = this.props;

                const originalProps: OriginalProps = rest as any;

                return <Query query={gql(query)} variables={variables}>{(result: QueryResult<TData, TVariables>) => (
                    <Component {...originalProps} result={result} />
                )}</Query>
            }
        }

        if (process.env.NODE_ENV !== 'production') {
            (withSiteQuery as any).displayName = wrapDisplayName(Component, 'hoc')
        }

        return WithSiteQuery;
    }
}