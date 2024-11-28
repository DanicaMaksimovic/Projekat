import '../styles/Button.css';


const Button = (props) => {

    let klase = "button";
    if (props.bojaPozadine) {
        klase += " button-bg-" + props.bojaPozadine;
    } else {
        klase += " button-bg-black";
    }

    if (props.bojaTeksta) {
        klase += " button-color-" + props.bojaTeksta;
    } else {
        klase += " button-color-black";
    }

    if (props.okvir) {
        klase += " button-border-" + props.okvir;
    }

    if (props.className){
        klase += " " + props.className;
    }

    if (props.fullWidth) {
        klase += " button-fullwidth";
    }

    if (props.poravnanje) {
        klase += " button-text-poravnanje-" + props.poravnanje;
    }

    const {bojaPozadine, bojaTeksta, okvir, className, fullWidth, poravnanje, ...rest} = props;


    return <div {...rest} className={klase}>{props.tekst}</div>
}

export default Button;