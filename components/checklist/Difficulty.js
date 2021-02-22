import '../../style.css';

class Difficulty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            level: props.level
        };
    }

    render() {
        let level = this.state.level;
        let text;
        if (level === 10) {
            text = 'Easy';
        } else if (level === 20) {
            text = 'Medium';
        } else {
            text = 'Hard';
        }
        return (
            <div className={'box d-' + level}>
                {text}
           </div>
        )
    }
}

export default Difficulty;