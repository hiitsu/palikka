import React from "react";
import Api from "./Api";

type AuthContextType = { signedUp: boolean; error: string | null };
const AuthContext = React.createContext<AuthContextType>({ signedUp: false, error: null });

type State = AuthContextType;
type Props = {};

class AuthProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { signedUp: false, error: null };
  }

  async componentDidMount() {
    try {
      await Api.user.signup();
      this.setState({ signedUp: true, error: null });
    } catch (error) {
      this.setState({ signedUp: false, error });
    }
  }

  render() {
    return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>;
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
