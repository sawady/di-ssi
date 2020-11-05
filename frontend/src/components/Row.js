import "./Row.css";

export default function Row(props) {
  return (
    <div className="row">
      <span className="row_title">{props.title}</span>
      {props.children}
    </div>
  );
}
