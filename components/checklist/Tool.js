
class Tool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            icon: props.icon,
            url: props.url
        };
    }

    render() {
        return (
            <a href={this.state.url} target="_blank">
                <img src={'https://seobuddy.com/dynamic-assets/checklist-tools/' + this.state.icon} title={this.state.name}/>
            </a>
        )
    }
}

export default Tool;