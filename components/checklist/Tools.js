import Tool from "./Tool";

class Tools extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tools: props.tools
        };
    }

    render() {
        let tools = this.state.tools;

        return (
            <span>
            {Object.entries(tools).map(([key, tool]) => (
                    <Tool key={tool.url} name={tool.name} icon={tool.icon} url={tool.url}/>
                ))}
            </span>
        )
    }
}

export default Tools;