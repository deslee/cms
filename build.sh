# build content graphql
docker build -f Dockerfile --target Content.GraphQL -t deslee/content.graphql .
docker build -f Dockerfile --target Content.Asset.Job.Runner -t deslee/content.asset.job.runner . 