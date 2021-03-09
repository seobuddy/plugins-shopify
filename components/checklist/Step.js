import Difficulty from "./Difficulty";
import Impact from "./Impact";
import Cost from "./Cost";
import Sop from "./Sop";
import Status from "./Status";
import Tools from "./Tools";
import Extras from "./Extras";
import TickIcon from "./TickIcon";
import AbandonedIcon from "./AbandonedIcon";

class Step extends React.Component {
    constructor(props) {
        super(props);
        this.apiHost = props.apiHost;
        this.state = {
            data: props.data,
            shortId: props.shortId
        };

        this.setStepState = this.setStepState.bind(this)
    }

    setStepState(statusName) {
        let data = this.state.data;
        data.status_name = statusName;
        this.setState({
            data: data
        })
    }

    render() {
        return (
            <div className={'step ' + (this.state.data.status_name === 'done' ? 'completed' : (this.state.data.status_name === 'abandoned' ? 'abandoned' : ''))}>
                <div className="title col-title">
                    <div className="title-wrapper">
                        <div>{this.state.data.title}</div>
                        <div className={'completed ' + (this.state.data.status_name === 'done' ? '' : 'hidden')}><TickIcon/></div>
                        <div className={'abandoned ' + (this.state.data.status_name === 'abandoned' ? '' : 'hidden')}><AbandonedIcon/></div>
                    </div>
                </div>
                <div className="title col-status"><Status shortId={this.state.shortId} stateHandler={this.setStepState} state={this.state.data.status_name} stepId={this.state.data.project_step_id} apiHost={this.apiHost}/></div>
                <div className="title col-difficulty"><Difficulty level={this.state.data.difficulty}/></div>
                <div className="title col-impact"><Impact level={this.state.data.impact}/></div>
                <div className="title col-cost"><Cost paid={this.state.data.free}/></div>
                <div className="title col-tools"><Tools tools={this.state.data.tools}/></div>
                <div className="title col-sop"><Sop url={this.state.data.sop_url} name={this.state.data.sop}/></div>
                <div className="title col-extra"><Extras step={this.state.data}/></div>
           </div>
        )
    }
}

export default Step;