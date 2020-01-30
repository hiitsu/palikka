import Link, { LinkProps } from "next/link";

export type StyledNextLinkProps = LinkProps & { text: string };

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
            box-shadow: 0 4px #ccc;
            z-index: 1000000;
            display: inline-block;
            line-height: 3em;
            user-select: none;
          }
          .button:active {
            background-color: #cdcdcd;
            box-shadow: 0 2px #888;
            transform: translateY(2px);
          }
          .button:hover,
          .button:focus {
            background-color: #efefef;
          }
        `}</style>
      </a>
    </Link>
  );
}
