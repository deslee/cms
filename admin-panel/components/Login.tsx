import * as React from 'react'

interface Props {

}

// generic login form
class Login extends React.Component<Props> {

    handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="email" />
                <input type="password" />
                <button type="submit">Submit</button>
            </form>
        )
    }
}

export default Login