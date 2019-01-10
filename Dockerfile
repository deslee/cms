FROM microsoft/dotnet:2.2-sdk as build

WORKDIR /app

# copy csproj and restore as distinct layers
COPY ./Content.Data/*.csproj ./Content.Data/
COPY ./Content.GraphQL/*.csproj ./Content.GraphQL/
COPY ./Content.Asset.Job/*.csproj ./Content.Asset.Job/
COPY ./Content.Asset.Job.Runner/*.csproj ./Content.Asset.Job.Runner/
WORKDIR /app/Content.GraphQL
RUN dotnet restore
WORKDIR /app

# copy and publish app and libraries
COPY ./Content.Data/ ./Content.Data/
COPY ./Content.GraphQL/ ./Content.GraphQL/
COPY ./Content.Asset.Job/ ./Content.Asset.Job/
COPY ./Content.Asset.Job.Runner/ ./Content.Asset.Job.Runner/
WORKDIR /app/Content.GraphQL
RUN dotnet publish -c Release -o out
WORKDIR /app/Content.Asset.Job.Runner
RUN dotnet publish -c Release -o out

FROM microsoft/dotnet:2.2-aspnetcore-runtime as Content.GraphQL
WORKDIR /app
RUN mkdir data
COPY --from=build /app/Content.GraphQL/out ./
COPY --from=build /app/Content.GraphQL/appsettings.*.json ./
ENTRYPOINT ["dotnet", "Content.GraphQL.dll"]

FROM microsoft/dotnet:2.2-runtime as Content.Asset.Job.Runner
WORKDIR /app
RUN mkdir data
COPY --from=build /app/Content.Asset.Job.Runner/out ./
COPY --from=build /app/Content.Asset.Job.Runner/appsettings.*.json ./
ENTRYPOINT ["dotnet", "Content.Asset.Job.Runner.dll"]