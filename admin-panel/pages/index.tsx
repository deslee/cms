import { withAuth } from "../data/auth";

const IndexPage = ({user, updateUser} : any) => {
    return (
        <div>{user}<button onClick={() => updateUser("desmond")}>click me</button></div>
    )
}

export default withAuth(IndexPage);