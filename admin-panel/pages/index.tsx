import { withAuth, AuthUser } from "../data/auth";
import { withApi, WithApiInjectedProps } from "../data/api";

interface Props {
    user: AuthUser
}

const IndexPage = ({ user, api }: Props & WithApiInjectedProps) => {
    return (
        <div>{user && user.token}
            <br />
            <button onClick={async () => {
                var result = await api.login({ email: 'desmondclee@email.com', password: 'pass' })
                console.log(result);
            }}>Login</button>
        </div>
    )
}

export default withApi(withAuth(IndexPage));