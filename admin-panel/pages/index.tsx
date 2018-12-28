import AppBar from "../components/AppBar";
import { withApi, WithApiInjectedProps } from "../data/api";

interface Props {
}

const IndexPage = ({}: Props & WithApiInjectedProps) => {
    return (
        <div>
            <AppBar />
        </div>
    )
}

export default withApi(IndexPage);