import { Component } from "react";
import { debounce } from "../util";

type ParentWithProps = { children: any };
type ParentWithState = { width: number };

export default class ParentWith extends Component<ParentWithProps, ParentWithState> {
  ref: HTMLDivElement | null;
  constructor(props: ParentWithProps) {
    super(props);

    this.ref = null;

    this.state = {
      width: 0
    };

    this.handlSetRef = this.handlSetRef.bind(this);
    this.handleResize = debounce(this.handleResize.bind(this), 50);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handlSetRef(ref: HTMLDivElement) {
    this.ref = ref;
    this.handleResize();
  }

  handleResize() {
    const width = this.ref?.clientWidth || 0;
    this.setState({ width });
  }

  render() {
    return (
      <div ref={this.handlSetRef} style={{ width: "100%" }}>
        {this.props.children(this.state)}
      </div>
    );
  }
}
