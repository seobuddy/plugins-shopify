import '../../style.css';

class Impact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            level: props.level
        };
    }

    render() {
        let level = this.state.level;

        return (
            <div className={'impact i-' + level}>
                <div></div>
                <div></div>
                <div></div>
           </div>
        )
    }
}

export default Impact;