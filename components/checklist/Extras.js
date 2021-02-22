import Extra from "./Extra";

class Extras extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step
        };
    }

    render() {
        let step = this.state.step;

        return (
            <span>
                <Extra url={step.extra_document_url} type={step.first_document_type}/>
                <Extra url={step.extra_video_url} type={step.second_document_type}/>
            </span>
        )
    }
}

export default Extras;