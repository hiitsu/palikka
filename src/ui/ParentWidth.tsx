import { Component } from "react";

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
    this.handleResize = this.handleResize.bind(this);
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
      <div ref={this.handlSetRef} className="full-width">
        {this.props.children(this.state)}
        <style jsx>{`
          .full-width {
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}
