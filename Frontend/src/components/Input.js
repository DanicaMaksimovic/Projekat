import '../styles/Input.css';

const Input = (props) => {

    const {className, ...rest} = props;

    const classNameDuzaVarijanta = "input" + (className ? " " + className : "");

    return <input {...rest} className={classNameDuzaVarijanta} />
}

export default Input;