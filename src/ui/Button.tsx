export type ButtonProps = { text: string; onClick: (event: any) => void };

export default function Button(props: ButtonProps) {
  return (
    <button className="button" onClick={props.onClick}>
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
          user-select: none;
          text-align: center;
        }
        .button:active {
          background-color: #cdcdcd;
          box-shadow: 2px 2px #888;
          transform: translateY(2px);
        }
        .button:hover,
        .button:focus {
          background-color: #efefef;
        }
      `}</style>
    </button>
  );
}
