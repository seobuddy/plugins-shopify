import '../../style.css';

class Cost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paid: props.paid
        };
    }

    render() {
        let paid = this.state.paid;
        let text = 'Free';
        if (paid) {
            text = '$$$';
        }
        return (
            <div className={'cost'}>
                {text}
           </div>
        )
    }
}

export default Cost;