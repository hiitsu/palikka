import React from "react";
import Api from "./Api";

type AuthContextType = { signedUp: boolean };
const AuthContext = React.createContext<AuthContextType>({ signedUp: false });

type State = { signedUp: boolean };
type Props = {};

class AuthProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { signedUp: false };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    const token = await Api.user.signup();
    localStorage && localStorage.setItem("token", token);
    this.setState({ signedUp: true });
  }

  login() {}

  logout() {
    this.setState({ signedUp: false });
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          signedUp: this.state.signedUp
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
