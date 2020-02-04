import Link, { LinkProps } from "next/link";

export type StyledNextLinkProps = LinkProps & { text: string; style?: any };

export default function StyledNextLink(props: StyledNextLinkProps) {
  return (
    <Link {...props}>
      <a className="button">
        {props.text}
        <style jsx>{`
          .button {
            width: 160px;
            height: 3em;
            background-color: #fff;
            font-weight: bolder;
            color: black;
            border-radius: 5px;
            border: 1px solid #000;
            text-decoration: none;
            outline: none;
            box-shadow: 4px 4px #ccc;
            z-index: 1000000;
            display: inline-block;
            line-height: 3em;
            user-select: none;
            text-align: center;
          }
          /*.center {
            position: absolute;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            top: 1.5em;
          }*/
          .button:active {
            background-color: #cdcdcd;
            box-shadow: 2px 2px #888;
            transform: translateY(2px);
          }
          .button:hover,
          .button:focus {
            background-color: #fafafa;
          }
        `}</style>
      </a>
    </Link>
  );
}
